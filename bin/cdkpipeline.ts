#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkpipelinePipelineStack } from '../lib/cdkpipeline-pipeline-stack';

const app = new cdk.App();
new CdkpipelinePipelineStack(app, 'CdkpipelinePipelineStack', {
    env: { account: '471276646031', region: 'eu-west-1' }
});

app.synth();