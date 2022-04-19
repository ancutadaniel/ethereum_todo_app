const TodoList = artifacts.require('TodoList');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract('TodoList', async (accounts) => {
  let todoList;
  before(async () => {
    todoList = await TodoList.deployed();
  });

  it('contract deployed successfully and has a address', async () => {
    const address = await todoList.address;

    assert.notEqual(address, 0x0);
    assert.notEqual(address, '');
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.isString(address);
  });

  it('list a task and check the values', async () => {
    const taskCount = await todoList.taskCount();
    const task = await todoList.tasks(taskCount);
    // task id is equal to taskCount
    assert.equal(task.id.toNumber(), taskCount.toNumber());
    assert.equal(task.content, 'First task');
    assert.equal(task.completed, false);
    assert.equal(taskCount.toNumber(), 1);
  });

  it('create a task and check the event ', async () => {
    const result = await todoList.createTask('A new task');
    const taskCount = await todoList.taskCount();
    const task = await todoList.tasks(taskCount);

    // check the event has trigger
    const event = result.logs[0].args;

    assert.equal(taskCount.toNumber(), 2);
    assert.equal(task.content, 'A new task');

    assert.equal(event.id.toNumber(), taskCount.toNumber());
    assert.equal(event.content, 'A new task');
    assert.isFalse(event.completed, 'Completed should be false');
  });

  it('complete / toggle a task', async () => {
    const result = await todoList.toggleCompleted(1);
    const task = await todoList.tasks(1);

    assert.isTrue(task.completed, 'Task should be completed');

    const event = result.logs[0].args;
    // console.log(event);

    assert.equal(event.id.toNumber(), 1, 'Id should be the same');
    assert.isTrue(event.completed, 'Completed should be true');
  });
});
