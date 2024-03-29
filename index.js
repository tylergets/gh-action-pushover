const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require("node-fetch-commonjs");
try {

    const jobName = core.getInput('job-name');
    const jobStatus = core.getInput('job-status');
    const pushoverApiToken = core.getInput('pushover-api-token');
    const pushoverUserKey = core.getInput('pushover-user-key');

    const repoName = github.context.repo.repo;

    console.log('Sending Pushover Notification')

    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);

    const title = `${jobName} - ${repoName}`;
    const message = `Job ${jobName} ${jobStatus === 'success' ? 'succeeded' : 'failed'}`;

    fetch('https://api.pushover.net/1/messages.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: pushoverApiToken,
            user: pushoverUserKey,
            title,
            message,
            priority: jobStatus === 'success' ? 0 : 1
        })
    })


} catch (error) {
    core.setFailed(error.message);
}
