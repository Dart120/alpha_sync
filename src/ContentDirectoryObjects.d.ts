export interface ContentDirectoryObject {
  // Object as defined in the upnp content directory spec
  // all required variables are required in the spec and the optionals arent
  // relatedService: Service
  id: string
  parentID: string
  title: string
  restricted: boolean
  creator?: string
  res?: string
  writeStatus?: string

}
export interface ContentDirectoryContainer extends ContentDirectoryObject {
  childCount?: number
  createClass?: string
  searchClass?: string
  searchable?: boolean
}
export interface UPNPContainer {
  'dc:title': string
  '@_id': string
  '@_parentID'?: string
  'upnp:class'?: 'object.container'
  '@_childcount'?: number
  children: Array<UPNPContainer | UPNPImage | UPNPVideo>
}
export interface UPNPImage {
  'upnp:class': 'object.item.imageItem.photo'
  'dc:title': string
  '@_id': string
  'dc:date'?: string
  res: any[]
  ORG: string
  LRG: string
  TN: string
  SM: string
}
export interface UPNPVideo {
  'upnp:class': 'object.item.videoItem.movie'
  'dc:title': string
  '@_id': string
  'dc:date'?: string
  ORG: string
  LRG: string
  TN: string
  SM: string
  res: any[]
}
export interface BrowseRequestObject {
  ObjectID: number | string
  BrowseFlag: 'BrowseDirectChildren' | 'BrowseMetadata'
  Filter: string
  StartingIndex: number
  RequestedCount: number
  SortCriteria?: string
}
export interface BrowseResponseObject {
  Result: string
  NumberReturned: number
  TotalMatches: number
  UpdateID: string
}
export interface ImageSizesResponse {
  '#text': string
}
