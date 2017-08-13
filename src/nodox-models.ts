import { IPoint, INode, IInput, IOutput, INodeDefinition, ConnectorType, IConnection, INodoxDocument, IInputDescriptor } from './interfaces/core-interfaces';

/**
    @class Node
*/
export class Node implements INode {
  private dirty: boolean;
  private processResult = null;
  private inputParams = null;
  isDirty(): boolean {
    return (this.dirty || false); // dirty || inputs are dirty
  }
  icon: string = "nodes:default";
  documentId; string;
  id: string;
  point: IPoint = new Point(0, 0);
  name: string;
  nodeType: string;
  inputs: Array<IInput> = new Array<IInput>();
  outputs: Array<IOutput> = new Array<IOutput>();
  //canvasManager: ICanvasManager;
  definition: INodeDefinition;

  isSelected: boolean;
  merge(n: INode): INode {
    this.id = n.id;
    this.name = n.name;
    this.nodeType = n.nodeType;
    this.documentId = n.documentId;
    this.point = new Point(n.point.x, n.point.y);
    n.inputs.forEach(i => this.inputs.push(new Input().merge(i)));
    n.outputs.forEach(o => this.outputs.push(new Output().merge(o)));
    return this;
  }
}

export class NodeValues {
  keyNames: Array<string>;
  inputLengths: any;
  maxLength: number;
  minLength: number;
  values: any;
}

export class ConnectorValue {
  connectorName: string;
  dataType: string;
  values: Array<any>;
}

export class Output implements IOutput {
  connectorType: ConnectorType = ConnectorType.Output;
  id: string;
  nodeId: string;
  name: string;
  dataType: string;
  label: string;
  index: number;
  connections = new Array<IConnection>();

  isInput(): boolean { return false; }
  merge(o: IOutput): IOutput {
    this.dataType = o.dataType;
    this.connectorType = o.connectorType;
    this.id = o.id;
    this.index = o.index;
    this.label = o.label;
    this.name = o.name;
    this.nodeId = o.nodeId;
    return this;
  }
}

export class Input implements IInput {
  id: string;
  nodeId: string;
  connectorType: ConnectorType = ConnectorType.Input;
  isInput(): boolean { return true; }
  name: string;
  dataType: string;
  label: string;
  value: any;
  index: number;
  connection: IConnection;
  inputChanged: (name: string, value) => void;
  definition: IInputDescriptor;

  merge(i: IInput): Input {
    this.dataType = i.dataType;
    this.connectorType = i.connectorType;
    this.id = i.id;
    this.index = i.index;
    this.label = i.label;
    this.name = i.name;
    this.nodeId = i.nodeId;
    this.value = i.value;
    return this;
  }
}

///
export class Connection implements IConnection {
  //storage
  id: string;
  documentId: string;
  inputNodeId: string;
  outputNodeId: string;
  outputConnectorId: string;
  inputConnectorId: string;

  //model
  inputNode: INode;
  outputNode: INode;
  outputConnector: IOutput;
  inputConnector: IInput;

  //canvas
  //canvasManager: ICanvasManager;
  inputPoint: IPoint;
  outputPoint: IPoint;


  merge(c: IConnection): IConnection {
    this.id = c.id;
    this.documentId = c.documentId;
    this.inputConnectorId = c.inputConnectorId;
    this.inputNodeId = c.inputNodeId;
    this.outputConnectorId = c.outputConnectorId;
    this.outputNodeId = c.outputNodeId;
    return this;
  }
}

export class NodoxDocument implements INodoxDocument {
  id: string;
  name: string;
  description: string;
  nodes: INode[];
  connections: IConnection[];
  resultNodeId: string;
  author: string;
  authorEmail: string;
  cloneFunctions = {};
  merge(p: INodoxDocument): INodoxDocument {
    this.id = p.id;
    this.author = p.author;
    this.authorEmail = p.authorEmail;
    this.description = p.description;
    this.name = p.name;
    this.resultNodeId = this.resultNodeId;
    return this;
  }
  constructor() {
    this.nodes = new Array<INode>();
    this.connections = new Array<IConnection>();
  }
}

export class Point implements IPoint {
  x: number;
  y: number;

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(p: IPoint): Point {
    return new Point(this.x + p.x, this.y + p.y);
  }

  snapTo(gridX: number, gridY: number): Point {
    var x = Math.round(this.x / gridX) * gridX;
    var y = Math.round(this.y / gridY) * gridY;
    return new Point(x, y);
  }

  scale(factor: number): Point {
    return new Point(this.x * factor, this.y * factor);
  }

  scaleRelativeTo(point: IPoint, factor: number): Point {

    return this.subtract(point).scale(factor).add(point);
  }

  subtract(p: IPoint): Point {
    return new Point(this.x - p.x, this.y - p.y);
  }

}

