// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(uint => Task) public tasks;

  constructor() {
    createTask("First task");
  }

  function createTask(string memory _content) public {
    taskCount += 1;
    tasks[taskCount] = Task(taskCount, _content, false);
  }
}