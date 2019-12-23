// package: eidos
// file: cmo.proto

import * as cmo_pb from "./cmo_pb";
import {grpc} from "@improbable-eng/grpc-web";

type CMOget_all_actions = {
  readonly methodName: string;
  readonly service: typeof CMO;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof cmo_pb.AllActionsRequest;
  readonly responseType: typeof cmo_pb.AllActionsResponse;
};

export class CMO {
  static readonly serviceName: string;
  static readonly get_all_actions: CMOget_all_actions;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class CMOClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  get_all_actions(
    requestMessage: cmo_pb.AllActionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: cmo_pb.AllActionsResponse|null) => void
  ): UnaryResponse;
  get_all_actions(
    requestMessage: cmo_pb.AllActionsRequest,
    callback: (error: ServiceError|null, responseMessage: cmo_pb.AllActionsResponse|null) => void
  ): UnaryResponse;
}

