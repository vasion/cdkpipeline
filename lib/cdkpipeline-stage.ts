import {CfnOutput, Construct, Stage, StageProps} from "@aws-cdk/core";
import {CdkpipelineStack} from "./cdkpipeline-stack";

export class CdkpipelineStage extends Stage {
    public readonly urlOutput: CfnOutput;

    constructor(scope: Construct, id:string, props?: StageProps){
        super(scope, id, props);

        const service = new CdkpipelineStack(this, "WebService");

        this.urlOutput = service.urlOutput;
    }
}