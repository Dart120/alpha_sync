/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/return-await */
/// <reference types="jest" />
import * as nodeFetch from 'node-fetch'
import { MOCK_XML_STRING } from './mockData'
const { Response } = jest.requireActual('node-fetch')
jest.mock('node-fetch')

const mockFetch = async (url: nodeFetch.RequestInfo, init?: nodeFetch.RequestInit): Promise<nodeFetch.Response> => {
  switch (url) {
    case 'http://192.168.122.1:64321/dd.xml': {
      return Promise.resolve(
        new Response(MOCK_XML_STRING, { status: 200 })
      )
    }
    case 'badXML': {
      return Promise.reject(new Error('Could not request XML from server'))
    }
    default: {
      return Promise.reject(new Error('Unhandled request'))
    }
  }
}

beforeAll(() => {
  (nodeFetch.default as jest.MockedFunction<typeof nodeFetch.default>).mockImplementation(mockFetch)
})
