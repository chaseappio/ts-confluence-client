import {
    AtlassianCollection,
    AtlassianError,
    AtlassianGroup,
    AtlassianUser,
    isAtlassianError, Space
} from "../src/resources/types";
import {getTestConfluence} from "./lib/init";

describe('Confluence: Users', () => {

    const confluence = getTestConfluence();
    const testData = {
        testAccountId: "",
        testSpace: null,
        testPage: null,
        testLabelName: "test-label",
        testExistingLabel: null,
        testAddedLabel: null
    };

    beforeAll(async () => {
        // get the first space and use it for testing.
        let spaces = await confluence.space.getPage<Space>({
            start: 0,
            limit: 1
        });

        if (isAtlassianError<AtlassianCollection<Space>>(spaces)) {
            throw spaces as AtlassianError;
        } else {
            spaces = spaces as AtlassianCollection<Space>;
        }
        if (spaces.results.length > 0) {
            testData.testSpace = spaces.results.pop();
            const pages = await confluence.content.getPagesInSpace(testData.testSpace.key);
            if (pages.length > 0) {
                testData.testPage = pages.pop();
                const labels = await confluence.content.getContentLabels(testData.testPage.id);
                if (labels && labels.length > 0) {
                    testData.testExistingLabel = labels.pop();
                } else {
                    testData.testAddedLabel = await confluence.content.addContentLabel(
                        testData.testPage.id,
                        'test-label'
                    );
                }
            }
        }
    });

    it('will retrieve the current user', async () => {
        await confluence.users.getCurrentUser()
            .then((user: AtlassianUser) => {
                expect(user).toHaveProperty('accountId');
                testData.testAccountId = user.accountId;
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will gets user\'s groups', async () => {
        await confluence.users.getGroupsForUser(testData.testAccountId)
            .then((groups: AtlassianGroup[]) => {
                expect(groups.length).toBeGreaterThan(0);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will get content watch status for a user', async () => {

        await confluence.users.getContentWatchStatusForUser(testData.testAccountId, testData.testPage.id)
            .then(() => {
                // we don't know what to expect but a 20x return
                // is considered successful.
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will add content watch status for a user', async () => {

        await confluence.users.addContentWatcherForUser(testData.testAccountId, testData.testPage.id)
            .then(() => {
                // there is no return value for this.
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will remove content watch status for a user', async () => {

        await confluence.users.removeContentWatcherForUser(testData.testAccountId, testData.testPage.id)
            .then(() => {
                // there is no return value for this.
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will add label watch status for a user', async () => {

        await confluence.users.addLabelWatchStatusForUser(testData.testAccountId, testData.testLabelName)
            .then(() => {
                // there is no return value for this.
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will remove label watch status for a user', async () => {

        await confluence.users.removeLabelWatcherForUser(testData.testAccountId, testData.testLabelName)
            .then(() => {
                // there is no return value for this.
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will get space watch status for a user', async () => {
        await confluence.users.getSpaceWatchStatusForUser(testData.testAccountId, testData.testSpace.key)
            .then(() => {
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will add space watch status for a user', async () => {
        await confluence.users.addSpaceWatcherForUser(testData.testAccountId, testData.testSpace.key)
            .then(() => {
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

    it('will remove space watch status for a user', async () => {
        await confluence.users.removeSpaceWatcherForUser(testData.testAccountId, testData.testSpace.key)
            .then(() => {
                expect(true);
            })
            .catch((err: AtlassianError) => {
                throw new Error(`Error occurred: ${err.message}`);
            });
    }, 30000);

});
