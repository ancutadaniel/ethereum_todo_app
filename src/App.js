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
} from 'semantic-ui-react';

import Menu from './components/Menu';
import loadingImg from './images/logo512.png';
import getWeb3 from './utils/getWeb3';

import './App.css';
import TodoList from './build/contracts/TodoList.json';

const App = () => {
  const [web3, setWeb3] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [task, setTask] = useState();

  const loadWeb3 = async () => {
    const data = await getWeb3();
    setWeb3(data);

    if (data) {
      const getAccounts = await data.eth.getAccounts();
      // get networks id of deployed contract
      const getNetworkId = await data.eth.net.getId();
      // get contract data on this network
      const todoData = await TodoList.networks[getNetworkId];
      // get contract deployed address
      const contractAddress = todoData.address;
      // create a new instance of the contract - on that specific address
      const contractData = await new data.eth.Contract(
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
      console.log('task', taskNumber);
      for (let i = 0; i <= taskNumber; i++) {
        const task = await contract.methods.tasks(i).call();
        console.log(task);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  console.log(contract);

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
      <Container>
        <Button onClick={taskCount}>Task Count</Button>
      </Container>
    </div>
  );
};

export default App;
