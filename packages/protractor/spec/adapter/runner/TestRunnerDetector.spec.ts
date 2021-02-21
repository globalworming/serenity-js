import 'mocha';

import { expect } from '@integration/testing-tools';
import { CucumberConfig } from '@serenity-js/cucumber/lib/cli'; // tslint:disable-line:no-submodule-imports
import * as sinon from 'sinon';
import { CucumberAdapterConfig, TestRunnerDetector, TestRunnerLoader } from '../../../src/adapter/runner';
import { Photographer, TakePhotosOfFailures } from '../../../src';

/** @test {TestRunnerDetector} */
describe('TestRunnerDetector', () => {

    let detector: TestRunnerDetector,
        testRunnerLoader: sinon.SinonStubbedInstance<TestRunnerLoader>;

    beforeEach(() => {
        testRunnerLoader    = sinon.createStubInstance(TestRunnerLoader);
        detector            = new TestRunnerDetector(testRunnerLoader as unknown as TestRunnerLoader);
    });

    describe('when using TestRunnerAdapter for', () => {

        describe('Cucumber', () => {

            const
                emptyRunnerConfig: CucumberConfig = {},
                defaultAdapterConfig: CucumberAdapterConfig = { useStandardOutput: false, uniqueFormatterOutputs: false };

            it(`uses the configured runner`, () => {
                const runner = detector.runnerFor({
                    serenity: {
                        runner: 'cucumber',
                    },
                });

                expect(testRunnerLoader.forCucumber).to.have.been.calledWith(emptyRunnerConfig, defaultAdapterConfig);
            });

            it('uses the configured runner even when configuration for other runners is present as well', () => {
                const runner = detector.runnerFor({
                    serenity: {
                        runner: 'cucumber',
                    },
                    cucumberOpts: {},
                    jasmineNodeOpts: {},
                    mochaOpts: {},
                });

                expect(testRunnerLoader.forCucumber).to.have.been.calledWith(emptyRunnerConfig, defaultAdapterConfig);
            });

            it('uses Cucumber test runner when cucumberOpts are present in config', () => {
                const runner = detector.runnerFor({
                    cucumberOpts: {},
                });

                expect(testRunnerLoader.forCucumber).to.have.been.calledWith(emptyRunnerConfig, defaultAdapterConfig);
            });

            describe('instructs TestRunnerLoader', () => {

                describe('to take over standard output when the config', () => {

                    it('defines serenity.crew and there is no cucumberOpts.format specified', () => {
                        const runner = detector.runnerFor({
                            serenity: {
                                runner: 'cucumber',
                                crew: [ Photographer.whoWill(TakePhotosOfFailures) ]
                            }
                        });

                        expect(testRunnerLoader.forCucumber).to.have.been.calledWith(emptyRunnerConfig, {  useStandardOutput: true, uniqueFormatterOutputs: false });
                    });

                    it('defines serenity.crew and there is a cucumberOpts.format specified', () => {
                        const runner = detector.runnerFor({
                            serenity: {
                                runner: 'cucumber',
                                crew: [ Photographer.whoWill(TakePhotosOfFailures) ]
                            },
                            cucumberOpts: {
                                format: 'pretty'
                            }
                        });

                        expect(testRunnerLoader.forCucumber).to.have.been.calledWith({ format: 'pretty' }, {  useStandardOutput: true, uniqueFormatterOutputs: false });
                    });
                });

                describe('to redirect output to a temp file when the config', () => {

                    it('does not specify serenity.crew and there are is no cucumberOpts.format specified either', () => {
                        const runner = detector.runnerFor({
                            serenity: {
                                runner: 'cucumber',
                            }
                        });

                        expect(testRunnerLoader.forCucumber).to.have.been.calledWith(emptyRunnerConfig, {  useStandardOutput: false, uniqueFormatterOutputs: false });
                    });

                    it('does not specify serenity.crew, but there is a cucumberOpts.format specified', () => {
                        const runner = detector.runnerFor({
                            serenity: {
                                runner: 'cucumber',
                                crew: [],
                            },
                            cucumberOpts: {
                                format: 'pretty'
                            }
                        });

                        expect(testRunnerLoader.forCucumber).to.have.been.calledWith({ format: 'pretty' }, {  useStandardOutput: false, uniqueFormatterOutputs: false });
                    });
                });

                describe('make the formatter output files unique when the config', () => {

                    it('specifies multiCapabilities', () => {
                        const runner = detector.runnerFor({
                            cucumberOpts: {
                                format: [
                                    'json:results.json'
                                ]
                            },
                            multiCapabilities: [
                                {'browserName': 'chrome'},
                                {'browserName': 'firefox'},
                            ],
                        });

                        expect(testRunnerLoader.forCucumber).to.have.been.calledWith({ format: [ 'json:results.json' ] }, { useStandardOutput: false, uniqueFormatterOutputs: true });
                    });

                    it('specifies shardTestFiles', () => {
                        const runner = detector.runnerFor({
                            cucumberOpts: {
                                format: [
                                    'json:results.json'
                                ]
                            },
                            capabilities: {
                                shardTestFiles: true,
                            },
                        });

                        expect(testRunnerLoader.forCucumber).to.have.been.calledWith({ format: [ 'json:results.json' ] }, { useStandardOutput: false, uniqueFormatterOutputs: true });
                    });
                });
            });
        });

        describe('Jasmine', () => {

            it('uses Jasmine TestRunnerAdapter when no other runners are specified', () => {
                const runner = detector.runnerFor({});

                expect(testRunnerLoader.forJasmine).to.have.been.calledWith({});
            });

            it(`uses the configured runner`, () => {
                const runner = detector.runnerFor({
                    serenity: {
                        runner: 'jasmine',
                    },
                });

                expect(testRunnerLoader.forJasmine).to.have.been.calledWith({});
            });

            it('uses the configured runner even when configuration for other runners is present as well', () => {
                const runner = detector.runnerFor({
                    serenity: {
                        runner: 'jasmine',
                    },
                    cucumberOpts: {},
                    jasmineNodeOpts: {},
                    mochaOpts: {},
                });

                expect(testRunnerLoader.forJasmine).to.have.been.calledWith({});
            });

            it('uses Jasmine test runner when jasmineNodeOpts are present in config', () => {
                const runner = detector.runnerFor({
                    jasmineNodeOpts: {},
                });

                expect(testRunnerLoader.forJasmine).to.have.been.calledWith({});
            });
        });

        describe('Mocha', () => {

            it(`uses the configured runner`, () => {
                const runner = detector.runnerFor({
                    serenity: {
                        runner: 'mocha',
                    },
                });

                expect(testRunnerLoader.forMocha).to.have.been.calledWith({});
            });

            it('uses the configured runner even when configuration for other runners is present as well', () => {
                const runner = detector.runnerFor({
                    serenity: {
                        runner: 'mocha',
                    },
                    cucumberOpts: {},
                    jasmineNodeOpts: {},
                    mochaOpts: {},
                });

                expect(testRunnerLoader.forMocha).to.have.been.calledWith({});
            });

            it('uses Mocha test runner when jasmineNodeOpts are present in config', () => {
                const runner = detector.runnerFor({
                    mochaOpts: {},
                });

                expect(testRunnerLoader.forMocha).to.have.been.calledWith({});
            });
        });
    });
});
