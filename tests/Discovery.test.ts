/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/dot-notation */
import { Discovery } from '../src/Discovery'
import { type Service } from '../src/Types'
import { XMLParser } from 'fast-xml-parser'
import fetch from 'node-fetch'
import { MOCK_XML_STRING, MOCK_XML_OBJ, MOCK_SERVICE_LIST } from './mockData'
import { expectTypeOf, runInTests, typecheck } from '@humeris/espresso-shot'
describe('Discovery_class', () => {
  const realParser: XMLParser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true
  })
  const spiedXMLParser = jest.spyOn(realParser, 'parse')
  describe('discover_avaliable_services', () => {
    it('should discover avaliable services', async () => {
      const discovery = new Discovery(realParser)
      await discovery.discover_avaliable_services()
      // Assertions
      expect(fetch).toHaveBeenLastCalledWith('http://192.168.122.1:64321/dd.xml', { headers: { Accept: '*/*' }, method: 'GET' })
      expect(discovery.contentDirectoryDetails).toBeDefined()

      // Ensure the parse method was called with the correct arguments
      expect(spiedXMLParser).toHaveBeenCalledWith(MOCK_XML_STRING)
      expectTypeOf(discovery.contentDirectoryDetails).toExtend<Service>()
    })
    it('should throw an error when one of its components fail', async () => {
      const discovery = new Discovery(realParser)
      discovery['discoveredServiceDirectoryUrl'] = 'bad'
      await expect(discovery.discover_avaliable_services()).rejects.toThrow('Error when discovering avaliable services')
    })
  })

  describe('parse_services', () => {
    it('should assign the last CD service it finds to the ContentDirectory Field', () => {
      const discovery = new Discovery(realParser)
      discovery['services'] = MOCK_SERVICE_LIST
      discovery['parse_services']()
      expectTypeOf(discovery.contentDirectoryDetails).toExtend<Service>()
    })
    it('should not assign a CD service when it does not find one', () => {
      const discovery = new Discovery(realParser)
      discovery['services'] = []
      discovery['parse_services']()
      expect(discovery.contentDirectoryDetails).toBeUndefined()
    })
  })
  describe('construct_url', () => {
    it('should construct the url correctly', () => {
      const discovery = new Discovery(realParser)
      discovery.serverIP = 'danielswiedan'
      discovery.serverPort = '90210'
      expect(discovery.construct_url('/dd.xml')).toBe('http://danielswiedan:90210/dd.xml')
    })
  })
  describe('get_service_list', () => {
    it('should parse from serviceDirectoryObject an array of services', () => {
      const discovery = new Discovery(realParser)
      discovery['serviceDirectoryObject'] = MOCK_XML_OBJ
      discovery['get_service_list']()
      expectTypeOf(discovery['services']).toExtend<Service[]>()
    })
    it('should handle the error when serviceDirectoryObject is malformed', () => {
      const discovery = new Discovery(realParser)

      const MOCK_MAL_XML_OBJ: any = structuredClone(MOCK_XML_OBJ)
      MOCK_MAL_XML_OBJ.root.device.serviceList = null
      discovery['serviceDirectoryObject'] = MOCK_MAL_XML_OBJ
      discovery['get_service_list']()
      expect(discovery['services']).toBeUndefined()
    })
  })
})
