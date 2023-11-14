#!/usr/bin/python
 
import subprocess
import pprint
import json
import sys
 
from collections import namedtuple
 
modules = json.loads(subprocess.check_output(["lua", "doc2json.lua", "./BlizzardInterfaceCode/Interface/AddOns/Blizzard_APIDocumentationGenerated"]).decode())
 
UNKOWN_TYPES = {
    "AnimationDataEnum": "any",
    "AuraData": "any",
    "AzeriteEmpoweredItemLocation": "any",
    "AzeriteItemLocation": "any",
    "BlendMode": "string",
    "CachedRewardType": "any",
    "ChatBubbleFrame": "any",
    "colorRGBA": "any",
    "colorRGB": "any",
    "CScriptObject": "any",
    "CurveType": "string",
    "DrawLayer": "string",
    "EmptiableItemLocation": "any",
    "FilterMode": "string",
    "FramePoint": "string",
    "FrameStrata": "string",
    "HTMLTextType": "any",
    "InsertMode": "string",
    "InventorySlots": "any",
    "ItemInfo": "any",
    "ItemSoundType": "any",
    "ItemTransmogInfo": "any",
    "LoopType": "string",
    "ModelSceneFrameActor": "any",
    "ModelSceneFrame": "any",
    "NotificationDbId": "any",
    "Orientation": "string",
    "PlayerLocation": "any",
    "ReportInfo": "string",
    "SimplePathAnim": "any",
    "SmoothingType": "string",
    "StatusBarFillStyle": "string",
    "TextureAsset": "any",
    "TextureAssetDisk": "any",
    "TooltipComparisonItem": "any",
    "TooltipData": "any",
    "TransmogLocation": "any",
    "TransmogPendingInfo": "any",
    "UiMapPoint": "any",
    "uiRect": "any",
    "vector2": "any",
    "vector3": "any",
    "WeeklyRewardChestThresholdType": "any",
    "ItemLocation": "any",
    "CalendarGetEventType": "any",
    "CharCustomizationType": "any",
}
 
UNKOWN_OBJECTS = {
    "ItemLocation": "any",
}
 
EXTENDS = {
    "SimpleFontString": "SimpleRegion",
    "SimpleCheckbox": "SimpleButton",
    "SimpleButton": "SimpleFrame",
    "SimpleRegion": "SimpleScriptRegionResizing",
    "SimpleFrame": "SimpleScriptRegionResizing",
    "SimpleScriptRegionResizing": "SimpleScriptRegion",
    "SimpleScriptRegion": "SimpleObject",
    "SimpleObject": "SimpleFrameScriptObject",
    "SimpleFont": "SimpleFrameScriptObject",
}
 
class Emitter:
    def __init__(self):
        self.prev_level = 0
 
    def emit(self, indent, s, *args):
        self.prev_level = indent
        yield "  "*indent + (s % args)
 
    def emit_separator(self, indent):
        if self.prev_level == indent:
            yield ""
 
def tostring(val):
    if val == True:
        return "true"
    elif val == False:
        return "false"
    elif val == None:
        return undefined
    elif type(val) in (int, float):
        return str(val)
    else:
        assert type(val) == str
        return json.dumps(val)
 
TSValue = namedtuple("TSValue", ("name", "type", "nilable", "default"))
TSReturn = namedtuple("TSReturn", ("type", "nilable"))
 
def format_value(val, aliases, nilable_explicit_undefined=False):
    if nilable_explicit_undefined:
        return "%s: %s%s" % (val.name, format_type(val.type, aliases), (val.nilable or val.default) and "|undefined" or "")
    else:
        return "%s%s: %s" % (val.name, (val.nilable or val.default) and "?" or "", format_type(val.type, aliases))
 
def format_type(composite_type, aliases):
    def format_inner_type(typ):
        if aliases.get(typ):
            return aliases[typ]
        elif typ == "cstring":
            return "string"
        elif typ in "luaIndex":
            return "number"
        elif typ == "bool":
            return "boolean"
        return typ
    assert (composite_type[0] == "table") == (composite_type[1] is not None)
    if composite_type[0] == "table":
        return format_inner_type(composite_type[1]) + "[]"
    else:
        return format_inner_type(composite_type[0])
 
class Separator:
    def emit(self, emitter, indent, aliases):
        yield from emitter.emit_separator(indent)
 
class TSContainer:
    def __init__(self):
        self.children = []
 
    def append(self, child):
        self.children.append(child)
 
    def emit(self, emitter, indent, aliases):
        for child in self.children:
            if isinstance(child, str):
                yield from emitter.emit(indent, child)
            else:
                yield from child.emit(emitter, indent, aliases)
 
class TSNamedContainer(TSContainer):
    def __init__(self, name, keyword):
        super().__init__()
        self.name = name
        self.keyword = keyword
 
    def emit(self, emitter, indent, aliases):
        parent = EXTENDS.get(self.name)
        extends = ""
        if parent:
            extends = f" extends {parent}"
        yield from emitter.emit_separator(indent)
        yield from emitter.emit(indent, "%s %s%s {", self.keyword, self.name, extends)
        yield from super().emit(emitter, indent+1, aliases)
        yield from emitter.emit(indent, "}")
 
class TSFunction(namedtuple("TSFunction", ("name", "args", "rets", "prefix", "sigil"))):
    def emit(self, emitter, indent, aliases):
        # TODO: handle stride
        last_mandatory_index = 0
        for i, a in enumerate(self.args or []):
            if not a.nilable:
                last_mandatory_index = i
        args = ", ".join(format_value(a, aliases, nilable_explicit_undefined=i<last_mandatory_index) for i, a in enumerate(self.args or []))
        rets = ["%s%s" % (format_type(r.type, aliases), r.nilable and "|undefined" or "") for r in self.rets or []]
        if len(rets) == 0:
            rets = "void"
        elif len(rets) == 1:
            rets = rets[0]
        elif len(rets) > 1:
            rets = "LuaMultiReturn<[%s]>" % ", ".join(rets)
        else:
            assert False
 
        yield from emitter.emit(indent, "%s(%s)%s%s;", self.prefix, args, self.sigil, rets or "void")
 
class TSField(TSValue):
    def emit(self, emitter, indent, aliases):
        yield from emitter.emit(indent, format_value(self, aliases) + ";")
 
class TSConst(TSValue):
    def emit(self, emitter, indent, alias):
        if self.default:
            yield from emitter.emit(indent, "const %s = %s;" % (format_value(self, aliases), tostring(self.default)))
        else:
            yield from emitter.emit(indent, "const %s;" % format_value(self, aliases))
 
possible_keys = {
    "": {"Tables"},
    "System": {"Name", "Namespace", "Events", "Functions", "Tables"},
    "ScriptObject": {"Name", "Tables", "Events", "Functions"},
    "Enumeration": {"Name", "Fields", "MinValue", "MaxValue", "NumValues"},
    "Structure": {"Name", "Fields", "Documentation"},
    "Constants": {"Name", "Values"},
    "CallbackType": {"Name", "Arguments"},
}
 
def get_composite_type(table):
    return (table["Type"], table.get("InnerType"))
 
def parse_function(function, table_type, is_callback):
    assert not (set(function.keys()) - {"Name", "Type", "Arguments", "Returns", "Documentation"})
    args = []
    rets = []
    if table_type == "System" or is_callback:
        args.append(TSValue("this", ("void", None), False, None))
    for arg in function.get("Arguments", []):
        assert not (set(arg.keys()) - {"Name", "Type", "Nilable", "InnerType", "Default", "Mixin", "Documentation", "StrideIndex"})
        args.append(TSValue(arg["Name"], get_composite_type(arg), arg["Nilable"] or (arg.get("Default") is not None), arg.get("Default")))
    for ret in function.get("Returns", []):
        assert not (set(ret.keys()) - {"Name", "Type", "Nilable", "InnerType", "Default", "Mixin", "Documentation", "StrideIndex"})
        rets.append(TSReturn(get_composite_type(ret), ret["Nilable"]))
    if is_callback:
        prefix = f"type {function['Name']} = "
        sigil = " => "
    elif table_type == "System":
        prefix = f"function {function['Name']}"
        sigil = ": "
    else:
        prefix = function["Name"]
        sigil = ": "
    return TSFunction(function["Name"], args, rets, prefix, sigil)
 
def process_table(root, ns, parent, enums, constants, aliases, table):
    table_type = table.get("Type")
    table_name = table.get("Name")
    table_ns = table.get("Namespace")
    table_fields = table.get("Fields")
    table_functions = table.get("Functions")
    table_tables = table.get("Tables")
    table_events = table.get("Events")
    table_min_value = table.get("MinValue")
    table_max_value = table.get("MaxValue")
    table_num_values = table.get("NumValues")
 
    unknown_keys = set(table.keys()) - possible_keys[table_type or ""] - {"Type"}
    if unknown_keys:
        print(table_type or "<empty>", unknown_keys, file=sys.stderr)
        assert not unknown_keys
 
    if table_type in ("System", "ScriptObject", None):
        assert (table_name is None) == (table_type is None)
        if table_name is None:
            container = parent
            child_ns = ns
        elif table_type == "System":
            if table_ns is None:
                container = parent
                child_ns = ns
            else:
                container = TSNamedContainer(table_ns, keyword="namespace")
                child_ns = container
                ns.append(container)
        elif table_type == "ScriptObject":
            container = TSNamedContainer(table_name.removesuffix("API"), keyword="interface")
            child_ns = ns
            ns.append(container)
        else:
            assert False
        for subtable in table.get("Tables") or []:
            process_table(root, child_ns, container, enums, constants, aliases, subtable)
        if table_functions:
            container.append(Separator())
            for function in table_functions:
                assert function["Type"] == "Function"
                container.append(parse_function(function, table_type, False))
    elif table_type == "Structure":
        container = TSNamedContainer(table_name, keyword="interface")
        ns.append(container)
        for field in table_fields:
            assert not (set(field.keys()) - {"Name", "Type", "Nilable", "InnerType", "Mixin", "Default", "Documentation"})
            assert (field.get("Type") == "table") == (field.get("InnerType") is not None)
            container.append(TSField(field["Name"], get_composite_type(field), field["Nilable"] or (field.get("Default") is not None), None))
        assert aliases.get(table_name) is None
        #if isinstance(ns, TSNamedContainer):
            #aliases[table_name] = f"{ns.name}.{table_name}"
    elif table_type == "Enumeration":
        container = TSNamedContainer(table_name, keyword="enum")
        enums.append(container)
        for field in table_fields:
            assert not (set(field.keys()) - {"Name", "Type", "EnumValue"})
            assert field["Type"] == table_name
            container.append(f"{field['Name']} = {field['EnumValue']},")
        assert aliases.get(table_name) is None
        aliases[table_name] = f"Enum.{table_name}"
    elif table_type == "Constants":
        container = TSNamedContainer(table_name, keyword="namespace")
        constants.append(container)
        for value in table["Values"]:
            assert not (set(value.keys()) - {"Name", "Type", "Value"})
            if value.get("Value"):
                container.append(f"const {value['Name']} = {value['Value']};")
            else:
                container.append(f"const {value['Name']}: {value['Type']};")
        #assert aliases.get(table_name) is None
        #aliases[table_name] = f"Constants.{table_name}"
    elif table_type == "CallbackType":
        ns.append(parse_function(table, table_type, True))
    else:
        assert False
 
    return parent
 
def emit_root(root, aliases):
    emitter = Emitter()
    yield from emitter.emit(0, "export {};")
    yield from emitter.emit(0, "declare global {")
    yield from emitter.emit(1, "type BigInteger = number;")
    yield from emitter.emit(1, "type BigUInteger = number;")
    yield from emitter.emit(1, "type CalendarEventID = string;")
    yield from emitter.emit(1, "type ClubId = string;")
    yield from emitter.emit(1, "type ClubInvitationId = string;")
    yield from emitter.emit(1, "type ClubStreamId = string;")
    yield from emitter.emit(1, "type FileAsset = string;")
    yield from emitter.emit(1, "type fileID = number;")
    yield from emitter.emit(1, "type GarrisonFollower = string;")
    yield from emitter.emit(1, "type IDOrLink = string | number;")
    yield from emitter.emit(1, "type kstringClubMessage = string;")
    yield from emitter.emit(1, "type kstringLfgListApplicant = string;")
    yield from emitter.emit(1, "type kstringLfgListSearch = string;")
    yield from emitter.emit(1, "type ModelAsset = string;")
    yield from emitter.emit(1, "type normalizedValue = number;")
    yield from emitter.emit(1, "type RecruitAcceptanceID = string;")
    yield from emitter.emit(1, "type ScriptRegion = SimpleScriptRegion;")
    yield from emitter.emit(1, "type SimpleButtonStateToken = string;")
    yield from emitter.emit(1, "type SingleColorValue = number;")
    yield from emitter.emit(1, "type size = number;")
    yield from emitter.emit(1, "type TBFFlags = string;")
    yield from emitter.emit(1, "type TBFStyleFlags = string;")
    yield from emitter.emit(1, "type textureAtlas = string;")
    yield from emitter.emit(1, "type textureKit = string;")
    yield from emitter.emit(1, "type time_t = number;")
    yield from emitter.emit(1, "type uiAddon = string;")
    yield from emitter.emit(1, "type uiFontHeight = number;")
    yield from emitter.emit(1, "type uiMapID = number;")
    yield from emitter.emit(1, "type uiUnit = number;")
    yield from emitter.emit(1, "type UnitToken = string;")
    yield from emitter.emit(1, "type WeeklyRewardItemDBID = string;")
    yield from emitter.emit(1, "type WOWGUID = string;")
    yield from emitter.emit(1, "type WOWMONEY = string;")
    yield from emitter.emit(1, "type luaFunction = (this: void, ...args: any[]) => any;")
    for t, fallback in UNKOWN_TYPES.items():
        yield from emitter.emit(1, f"type {t} = {fallback};")
    for t, typ in UNKOWN_OBJECTS.items():
        yield from emitter.emit(1, f"const {t}: {typ};")
    yield from root.emit(emitter, 1, aliases)
    yield from emitter.emit(0, "}")
 
root = TSContainer()
aliases = {}
enums = TSNamedContainer("Enum", keyword="namespace")
root.append(enums)
constants = TSNamedContainer("Constants", keyword="namespace")
root.append(constants)
for module in modules:
    process_table(root, root, root, enums, constants, aliases, module)
 
for line in emit_root(root, aliases):
    print(line)