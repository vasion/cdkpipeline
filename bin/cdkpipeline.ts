#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkpipelineStack } from '../lib/cdkpipeline-stack';

const app = new cdk.App();
new CdkpipelineStack(app, 'CdkpipelineStack');
