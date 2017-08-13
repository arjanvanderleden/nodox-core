import { ISerializer, INodoxDocument } from "./interfaces/core-interfaces";
import { Connection, NodoxDocument, Node } from "./nodox-models";

export class Serializer implements ISerializer {
      SerializeDocument(document:INodoxDocument):string{
        var doc : INodoxDocument = new NodoxDocument().merge(document);
        document.nodes.forEach(n=> doc.nodes.push(new Node().merge(n)));
        document.connections.forEach(c=> doc.connections.push(new Connection().merge(c)));
        return JSON.stringify(doc, null,'\t');
      }
    }
