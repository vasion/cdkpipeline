import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { CdkPipeline, SimpleSynthAction, CdkStage, ShellScriptAction } from "@aws-cdk/pipelines";
import { CdkpipelineStage } from "./cdkpipeline-stage";

export class CdkpipelinePipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        const pipeline = new CdkPipeline(this, "Pipeline", {
            pipelineName: "MyServicePipeline",
            cloudAssemblyArtifact,
            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: "GitHub",
                output: sourceArtifact,
                oauthToken: SecretValue.secretsManager('github-token'),
                owner: "vasion",
                repo: "cdkpipeline"
            }),
            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,
                buildCommand: "npm run build"
            })
        });

        // Stages
        const preprod = new CdkpipelineStage(this, "PreProd", {
            env: { account: "471276646031", region: "eu-west-1" }
        });
        const preProdStage: CdkStage = pipeline.addApplicationStage(preprod);
        preProdStage.addActions(new ShellScriptAction({
            actionName: "TestService",
            useOutputs: {
                ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput)
            },
            commands: [
                'curl -Ssf $ENDPOINT_URL'
            ]
        }));

        pipeline.addApplicationStage(new CdkpipelineStage(this, "Prod", {
            env: { account: "471276646031", region: "eu-west-1" }
        }));
    }
}