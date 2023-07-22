export const MOCK_XML_STRING = `<?xml version="1.0" encoding="utf-8"?>
<root xmlns="urn:schemas-upnp-org:device-1-0" xmlns:dlna="urn:schemas-dlna-org:device-1-0" xmlns:av="urn:schemas-sony-com:av">
  <specVersion>
    <major>1</major>
    <minor>0</minor>
  </specVersion>
  <device>
    <dlna:X_DLNADOC xmlns:dlna="urn:schemas-dlna-org:device-1-0">DMS-1.50</dlna:X_DLNADOC>
    <deviceType>urn:schemas-upnp-org:device:MediaServer:1</deviceType>
    <friendlyName>ILCE-6100</friendlyName>
    <manufacturer>Sony Corporation</manufacturer>
    <manufacturerURL>http://www.sony.com/</manufacturerURL>
    <modelDescription>SonyDigitalMediaServer</modelDescription>
    <modelName>SonyImagingDevice</modelName>
    <modelURL>http://www.sony.net/</modelURL>
    <UDN>uuid:00000000-0000-0010-8000-d44da4ab1abb</UDN>
    <serviceList>
      <service>
        <serviceType>urn:schemas-upnp-org:service:ContentDirectory:1</serviceType>
        <serviceId>urn:upnp-org:serviceId:ContentDirectory</serviceId>
        <SCPDURL>/CdsDesc.xml</SCPDURL>
        <controlURL>/upnp/control/ContentDirectory</controlURL>
        <eventSubURL>/upnp/event/ContentDirectory</eventSubURL>
      </service>
      <service>
        <serviceType>urn:schemas-upnp-org:service:ConnectionManager:1</serviceType>
        <serviceId>urn:upnp-org:serviceId:ConnectionManager</serviceId>
        <SCPDURL>/CmsDesc.xml</SCPDURL>
        <controlURL>/upnp/control/ConnectionManager</controlURL>
        <eventSubURL>/upnp/event/ConnectionManager</eventSubURL>
      </service>
      <service>
        <serviceType>urn:schemas-sony-com:service:XPushList:1</serviceType>
        <serviceId>urn:sony-com:serviceId:XPushList</serviceId>
        <SCPDURL>/XPlsDesc.xml</SCPDURL>
        <controlURL>/upnp/control/XPushList</controlURL>
        <eventSubURL>/upnp/event/XPushList</eventSubURL>
      </service>
      <service>
        <serviceType>urn:schemas-sony-com:service:DigitalImaging:1</serviceType>
        <serviceId>urn:schemas-sony-com:serviceId:DigitalImaging</serviceId>
        <SCPDURL>/DigitalImagingDesc.xml</SCPDURL>
        <controlURL>/upnp/control/DigitalImaging</controlURL>
        <eventSubURL></eventSubURL>
      </service>
    </serviceList>
    <iconList>
      <icon>
        <mimetype>image/jpeg</mimetype>
        <width>48</width>
        <height>48</height>
        <depth>24</depth>
        <url>/DLNA_camera_48.jpg</url>
      </icon>
      <icon>
        <mimetype>image/jpeg</mimetype>
        <width>120</width>
        <height>120</height>
        <depth>24</depth>
        <url>/DLNA_camera_120.jpg</url>
      </icon>
      <icon>
        <mimetype>image/png</mimetype>
        <width>48</width>
        <height>48</height>
        <depth>24</depth>
        <url>/DLNA_camera_48.png</url>
      </icon>
      <icon>
        <mimetype>image/png</mimetype>
        <width>120</width>
        <height>120</height>
        <depth>24</depth>
        <url>/DLNA_camera_120.png</url>
      </icon>
    </iconList>
    <av:standardCDS>5.0</av:standardCDS>
    <av:photoRoot>PhotoRoot</av:photoRoot>
  </device>
</root>`
export const MOCK_XML_OBJ = {
  '?xml': { '@_version': '1.0', '@_encoding': 'utf-8' },
  root: {
    specVersion: { major: 1, minor: 0 },
    device: {
      'dlna:X_DLNADOC': {
        '#text': 'DMS-1.50',
        '@_xmlns:dlna': 'urn:schemas-dlna-org:device-1-0'
      },
      deviceType: 'urn:schemas-upnp-org:device:MediaServer:1',
      friendlyName: 'ILCE-6100',
      manufacturer: 'Sony Corporation',
      manufacturerURL: 'http://www.sony.com/',
      modelDescription: 'SonyDigitalMediaServer',
      modelName: 'SonyImagingDevice',
      modelURL: 'http://www.sony.net/',
      UDN: 'uuid:00000000-0000-0010-8000-d44da4ab1abb',
      serviceList: {
        service: [
          {
            serviceType: 'urn:schemas-upnp-org:service:ContentDirectory:1',
            serviceId: 'urn:upnp-org:serviceId:ContentDirectory',
            SCPDURL: '/CdsDesc.xml',
            controlURL: '/upnp/control/ContentDirectory',
            eventSubURL: '/upnp/event/ContentDirectory'
          },
          {
            serviceType: 'urn:schemas-upnp-org:service:ConnectionManager:1',
            serviceId: 'urn:upnp-org:serviceId:ConnectionManager',
            SCPDURL: '/CmsDesc.xml',
            controlURL: '/upnp/control/ConnectionManager',
            eventSubURL: '/upnp/event/ConnectionManager'
          },
          {
            serviceType: 'urn:schemas-sony-com:service:XPushList:1',
            serviceId: 'urn:sony-com:serviceId:XPushList',
            SCPDURL: '/XPlsDesc.xml',
            controlURL: '/upnp/control/XPushList',
            eventSubURL: '/upnp/event/XPushList'
          },
          {
            serviceType: 'urn:schemas-sony-com:service:DigitalImaging:1',
            serviceId: 'urn:schemas-sony-com:serviceId:DigitalImaging',
            SCPDURL: '/DigitalImagingDesc.xml',
            controlURL: '/upnp/control/DigitalImaging',
            eventSubURL: ''
          }
        ]
      },
      iconList: {
        icon: [
          {
            mimetype: 'image/jpeg',
            width: 48,
            height: 48,
            depth: 24,
            url: '/DLNA_camera_48.jpg'
          },
          {
            mimetype: 'image/jpeg',
            width: 120,
            height: 120,
            depth: 24,
            url: '/DLNA_camera_120.jpg'
          },
          {
            mimetype: 'image/png',
            width: 48,
            height: 48,
            depth: 24,
            url: '/DLNA_camera_48.png'
          },
          {
            mimetype: 'image/png',
            width: 120,
            height: 120,
            depth: 24,
            url: '/DLNA_camera_120.png'
          }
        ]
      },
      'av:standardCDS': 5,
      'av:photoRoot': 'PhotoRoot'
    },
    '@_xmlns': 'urn:schemas-upnp-org:device-1-0',
    '@_xmlns:dlna': 'urn:schemas-dlna-org:device-1-0',
    '@_xmlns:av': 'urn:schemas-sony-com:av'
  }
}
export const MOCK_SERVICE_LIST = [
  {
    serviceType: 'urn:schemas-upnp-org:service:ContentDirectory:1',
    serviceId: 'urn:upnp-org:serviceId:ContentDirectory',
    SCPDURL: '/CdsDesc.xml',
    controlURL: '/upnp/control/ContentDirectory',
    eventSubURL: '/upnp/event/ContentDirectory'
  },
  {
    serviceType: 'urn:schemas-upnp-org:service:ConnectionManager:1',
    serviceId: 'urn:upnp-org:serviceId:ConnectionManager',
    SCPDURL: '/CmsDesc.xml',
    controlURL: '/upnp/control/ConnectionManager',
    eventSubURL: '/upnp/event/ConnectionManager'
  },
  {
    serviceType: 'urn:schemas-sony-com:service:XPushList:1',
    serviceId: 'urn:sony-com:serviceId:XPushList',
    SCPDURL: '/XPlsDesc.xml',
    controlURL: '/upnp/control/XPushList',
    eventSubURL: '/upnp/event/XPushList'
  },
  {
    serviceType: 'urn:schemas-sony-com:service:DigitalImaging:1',
    serviceId: 'urn:schemas-sony-com:serviceId:DigitalImaging',
    SCPDURL: '/DigitalImagingDesc.xml',
    controlURL: '/upnp/control/DigitalImaging',
    eventSubURL: ''
  }
]
