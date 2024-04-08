export interface MapData {
    maps: Map[];
    map: Map;
    groups: Group[];
    categories: { [key: string]: Category };
    regions: Region[];
    locations: Location[];
    heatmapGroups: any[];
    heatmapCategories: any[];
    routes: any[];
    notes: any[];
    sharedNotes: SharedNotes;
    maxMarkedLocations: number;
    tags: any[];
    tagsById: any[];
    distanceToolConfig: null;
    mapConfig: MapConfig;
    proCategoryLocationCounts: any[];
    searchQuery: null;
    presets: any[];
}

export interface Category {
    id: number;
    group_id: number;
    title: CategoryTitle;
    icon: Icon;
    info: null;
    template: null;
    order: number;
    has_heatmap: boolean;
    features_enabled: boolean;
    ign_enabled: boolean;
    ign_visible: boolean;
    visible: boolean;
    description: null;
    premium: boolean;
    display_type: DisplayType;
}

export enum DisplayType {
    Marker = "marker",
}

export enum Icon {
    ArtMerchant = "art_merchant",
    AssassinTomb = "assassin_tomb",
    Assassination = "assassination",
    BeatUp = "beat_up",
    Blacksmith = "blacksmith",
    CodexPage = "codex_page",
    Courier = "courier",
    Doctor = "doctor",
    FastTravel = "fast_travel",
    Feather = "feather",
    Glyph = "glyph",
    GondolaLoot = "gondola_loot",
    Race = "race",
    Statuette = "statuette",
    Tailor = "tailor",
    TemplarLair = "templar_lair",
    Treasure = "treasure",
    Viewpoint = "viewpoint",
}

export enum CategoryTitle {
    ArtMerchant = "Art Merchant",
    AssassinTomb = "Assassin Tomb",
    Assassination = "Assassination",
    BeatUp = "Beat Up",
    Blacksmith = "Blacksmith",
    CodexPage = "Codex Page",
    Courier = "Courier",
    Doctor = "Doctor",
    FastTravel = "Fast Travel",
    Feather = "Feather",
    Glyph = "Glyph",
    GondolaLoot = "Gondola Loot",
    Race = "Race",
    Statuette = "Statuette",
    Tailor = "Tailor",
    TemplarLair = "Templar Lair",
    Treasure = "Treasure",
    Viewpoint = "Viewpoint",
}

export interface Group {
    id: number;
    game_id: number;
    title: string;
    order: number;
    color: string;
    expandable: boolean;
    categories: Category[];
}

export interface Location {
    id: number;
    map_id: number;
    checked?: boolean;
    region_id: number | null;
    category_id: number;
    title: string;
    description: null | string;
    latitude: number;
    longitude: number;
    features: null;
    ign_marker_id: null;
    ign_page_id: null;
    tags: any[];
    media: Media[];
    category: Category;
}

export interface Media {
    id: number;
    title: TypeEnum;
    file_name: string;
    attribution: string;
    url: string;
    type: TypeEnum;
    mime_type: MIMEType;
    meta: null;
    order: number;
}

export enum MIMEType {
    ImageJPEG = "image/jpeg",
    ImagePNG = "image/png",
}

export enum TypeEnum {
    Empty = "",
    Image = "image",
}

export interface Map {
    id: number;
    title: string;
    slug: string;
}

export interface MapConfig {
    tile_sets: TileSet[];
    initial_zoom: number;
    start_lat: number;
    start_lng: number;
    overlay: null;
    overzoom: boolean;
}

export interface TileSet {
    id: number;
    map_id: number;
    name: string;
    path: string;
    extension: string;
    pattern: string;
    min_zoom: number;
    max_zoom: number;
    order: number;
    bounds: { [key: string]: Bound };
}

export interface Bound {
    x: X;
    y: X;
}

export interface X {
    max: number;
    min: number;
}

export interface Region {
    id: number;
    map_id: number;
    parent_region_id: null;
    title: string;
    subtitle: null;
    features: Feature[];
    center_x: null;
    center_y: null;
    order: number;
}

export interface Feature {
    type: string;
    geometry: Geometry;
    properties: Properties;
    id: number;
}

export interface Geometry {
    type: string;
    coordinates: Array<Array<number[]>>;
}

export interface Properties {
    id: number;
}

export interface SharedNotes {
}
