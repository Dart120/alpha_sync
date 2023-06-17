export interface ServiceDirectoryObject {
  root: ServerMetadata
}
export interface ServerMetadata {
  device: DeviceMetadata
}
export interface DeviceMetadata {
  serviceList: RedundantServiceList
}
export interface RedundantServiceList {
  service: Service[]
}
export interface Service {
  serviceType: string
  serviceId: string
  SCPDURL: string
  controlURL: string
  eventSubURL: string
}
export interface DigitalImagingDescXML {
  scpd: SpecificationInformation
}
export interface SpecificationInformation {
  X_DigitalImagingDeviceInfo: DeviceState
}
export interface DeviceState {
  X_CurrentContent_URL: RedundantX_CurrentContent_URL
}
export interface RedundantX_CurrentContent_URL {
  X_CurrentContent_URL_URL: SingleImageSizes[]
}
export interface SingleImageSizes {
  '#text': string
}
export interface ImageResponse {
  body: NodeJS.ReadableStream
}
