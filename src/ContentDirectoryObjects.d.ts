export interface ContentDirectoryObject{
    // Object as defined in the upnp content directory spec
    // all required variables are required in the spec and the optionals arent
    // relatedService: Service
    id: String
    parentID: String
    title: String
    restricted: Boolean
    creator?: String
    res?: String
    writeStatus?: String
    
}
export interface ContentDirectoryContainer extends ContentDirectoryObject{
    childCount?: number
    createClass?: string
    searchClass?: string
    searchable?: Boolean
}
export interface UPNPContainer{
'dc:title': string
'@_id': string
'@_parentID'?: string
'upnp:class'?: "object.container"
'@_childcount'?: number
children: (UPNPContainer | UPNPImage | UPNPVideo)[]
}
export interface UPNPImage{
    'upnp:class': "object.item.imageItem.photo"
    'dc:title': string
    '@_id': string
    'dc:date'?: string
    res:any[]
    ORG: string
    LRG: string
    TN: string
    SM: string
}
export interface UPNPVideo{
    'upnp:class': "object.item.videoItem.movie"
    'dc:title': string
    '@_id': string
    'dc:date'?: string
    ORG: string
    LRG: string
    TN: string
    SM: string
    res:any[]
}
export interface Date_to_Items {

}
export interface BrowseRequestObject{
    ObjectID: number |  string
    BrowseFlag: "BrowseDirectChildren" | "BrowseMetadata"
    Filter: string
    StartingIndex: number
    RequestedCount: number
    SortCriteria?: string 
}
export interface BrowseResponseObject{
    Result: string
    NumberReturned: Number
    TotalMatches: Number
    UpdateID: String 
}