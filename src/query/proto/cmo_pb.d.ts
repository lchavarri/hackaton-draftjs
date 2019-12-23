// package: eidos
// file: cmo.proto

import * as jspb from "google-protobuf";

export class AllActionsRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllActionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AllActionsRequest): AllActionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AllActionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllActionsRequest;
  static deserializeBinaryFromReader(message: AllActionsRequest, reader: jspb.BinaryReader): AllActionsRequest;
}

export namespace AllActionsRequest {
  export type AsObject = {
  }
}

export class AllActionsResponse extends jspb.Message {
  getResultJson(): string;
  setResultJson(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AllActionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AllActionsResponse): AllActionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AllActionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AllActionsResponse;
  static deserializeBinaryFromReader(message: AllActionsResponse, reader: jspb.BinaryReader): AllActionsResponse;
}

export namespace AllActionsResponse {
  export type AsObject = {
    resultJson: string,
  }
}

