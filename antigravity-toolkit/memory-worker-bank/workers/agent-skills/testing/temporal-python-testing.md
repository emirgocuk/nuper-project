# temporal-python-testing
Source: https://antigravity.codes/agent-skills/testing/temporal-python-testing

## AI Worker Instructions
When the user requests functionality related to temporal-python-testing, follow these guidelines and utilize this context.

## Scraped Content

# temporal-python-testing
```
resources/unit-testing.md
```
```
resources/integration-testing.md
```
```
resources/replay-testing.md
```
```
resources/local-setup.md
```
```
import pytestfrom temporalio.testing import WorkflowEnvironmentfrom temporalio.worker import Worker@pytest.fixtureasync def workflow_env():    env = await WorkflowEnvironment.start_time_skipping()    yield env    await env.shutdown()@pytest.mark.asyncioasync def test_workflow(workflow_env):    async with Worker(        workflow_env.client,        task_queue="test-queue",        workflows=[YourWorkflow],        activities=[your_activity],    ):        result = await workflow_env.client.execute_workflow(            YourWorkflow.run,            args,            id="test-wf-id",            task_queue="test-queue",        )        assert result == expected
```
```
import pytestfrom temporalio.testing import WorkflowEnvironmentfrom temporalio.worker import Worker@pytest.fixtureasync def workflow_env():    env = await WorkflowEnvironment.start_time_skipping()    yield env    await env.shutdown()@pytest.mark.asyncioasync def test_workflow(workflow_env):    async with Worker(        workflow_env.client,        task_queue="test-queue",        workflows=[YourWorkflow],        activities=[your_activity],    ):        result = await workflow_env.client.execute_workflow(            YourWorkflow.run,            args,            id="test-wf-id",            task_queue="test-queue",        )        assert result == expected
```
```
from temporalio.testing import ActivityEnvironmentasync def test_activity():    env = ActivityEnvironment()    result = await env.run(your_activity, "test-input")    assert result == expected_output
```
```
from temporalio.testing import ActivityEnvironmentasync def test_activity():    env = ActivityEnvironment()    result = await env.run(your_activity, "test-input")    assert result == expected_output
```
```
resources/unit-testing.md
```
```
resources/integration-testing.md
```
```
resources/local-setup.md
```
```
resources/replay-testing.md
```
Ensuring the reliability and correctness of distributed systems built with Temporal workflows is paramount for production readiness. This comprehensive agent skill provides a structured approach to testing your Python-based Temporal applications. It guides developers through various methodologies, from rapid unit tests utilizing time-skipping to robust integration and replay tests that validate determinism against real historical data. By leveraging this skill, you can confidently implement effective testing strategies, accelerate your development cycles, and maintain high-quality, resilient workflows that stand up to the complexities of distributed execution.

# When to Use This Skill
- •Implementing fast unit tests for Temporal workflows using time-skipping.
- •Setting up integration tests with mocked activities for isolated workflow logic validation.
- •Performing replay testing to guarantee determinism against existing workflow histories.
- •Integrating automated Temporal workflow tests into CI/CD pipelines.

# Pro Tips
- 💡Prioritize integration tests for the majority of your workflow logic, using mocked activities to isolate their behavior and ensure fast feedback.
- 💡Leverage Temporal's time-skipping feature aggressively in unit and integration tests to significantly reduce execution time for long-running workflows.
- 💡Regularly include replay testing in your CI/CD pipeline to proactively catch determinism violations that could lead to unexpected workflow failures in production environments.

