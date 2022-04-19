import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  GridRow,
  GridColumn,
  Segment,
  Dimmer,
  Loader,
  Image,
  Button,
  List,
  Checkbox,
  Form,
  Divider,
} from 'semantic-ui-react';

import Menu from './components/Menu';
import loadingImg from './images/logo512.png';
import getWeb3 from './utils/getWeb3';

import './App.css';
import TodoList from './build/contracts/TodoList.json';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [tasks, setTasks] = useState([]);

  const [value, setValue] = useState('');

  const loadWeb3 = async () => {
    const web3 = await getWeb3();

    if (web3) {
      const getAccounts = await web3.eth.getAccounts();
      // get networks id of deployed contract
      const getNetworkId = await web3.eth.net.getId();
      // get contract data on this network
      const todoData = await TodoList.networks[getNetworkId];
      // get contract deployed address
      const contractAddress = todoData.address;
      // create a new instance of the contract - on that specific address
      const contractData = await new web3.eth.Contract(
        TodoList.abi,
        contractAddress
      );

      setAccounts(getAccounts);
      setContract(contractData);
      setLoading(false);
    }
  };

  const taskCount = async () => {
    try {
      const taskNumber = await contract.methods.taskCount().call();
      let taskArr = [];
      for (let i = 1; i <= taskNumber; i++) {
        const task = await contract.methods.tasks(i).call();

        taskArr.push({
          id: +task.id,
          content: task.content,
          completed: task.completed,
        });
      }
      setTasks(taskArr);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleCompleted = async (id) => {
    setLoading(true);
    try {
      await contract.methods.toggleCompleted(id).send({ from: accounts[0] });
      taskCount();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await contract.methods.createTask(value).send({ from: accounts[0] });
      taskCount();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App'>
      <Menu account={accounts[0]} />
      {loading && (
        <Container>
          <Grid columns={1}>
            <GridRow>
              <GridColumn>
                <Segment>
                  <Dimmer active>
                    <Loader size='medium'>Loading</Loader>
                  </Dimmer>
                  <Image src={loadingImg} id='loadingImg' />
                </Segment>
              </GridColumn>
            </GridRow>
          </Grid>
        </Container>
      )}
      {!loading && (
        <>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Input
                label='Create Task'
                placeholder='Create Task'
                name='createTask'
                value={value}
                onChange={handleChange}
                required
              />

              <Button color='purple' type='submit'>
                Submit Task
              </Button>
            </Form>
          </Container>
          <Divider />
          <Container>
            <Button color='green' onClick={taskCount}>
              Show Tasks
            </Button>
            <Segment>
              Task Completed
              <Divider />
              <List>
                {tasks
                  .filter((task) => task.completed)
                  .map((task) => {
                    const { id, content, completed } = task;
                    return (
                      <List.Item key={id}>
                        <List.Content>
                          <Checkbox
                            label={content}
                            checked={completed}
                            onChange={() => handleToggleCompleted(id)}
                          />
                        </List.Content>
                      </List.Item>
                    );
                  })}
              </List>
            </Segment>
            <Divider horizontal>Or</Divider>
            <Segment>
              Task in progress
              <Divider />
              <List>
                {tasks
                  .filter((task) => !task.completed)
                  .map((task) => {
                    const { id, content, completed } = task;
                    return (
                      <List.Item key={id}>
                        <List.Content>
                          <Checkbox
                            label={content}
                            checked={completed}
                            onChange={() => handleToggleCompleted(id)}
                          />
                        </List.Content>
                      </List.Item>
                    );
                  })}
              </List>
            </Segment>
          </Container>
        </>
      )}
    </div>
  );
};

export default App;
