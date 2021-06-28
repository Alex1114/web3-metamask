import React,{useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, useParams } from 'react-router-dom'
import Web3 from 'web3';
import faunadb, {query as q} from 'faunadb'
import dotenv from 'dotenv'

dotenv.config()
const client = new faunadb.Client({secret: process.env.REACT_APP_FAUNA_KEY})
const web3 = new Web3(Web3.givenProvider);
const contractABI = require("../contract-abi.json");
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS

function GenerateMetadata(){
    const [count, setCount] = useState(0);
    const [cursells,setCurSells]=useState(0)
    const [comments,setComments]=useState("")
    const { serial_num } = useParams()
    
    useEffect(() => {
        const SamuraiContract = new web3.eth.Contract(contractABI, contractAddress);

        SamuraiContract.events.mintEvent({
            filter:{},
            fromBlock: 0,
          }, function(error, event){/*console.log(event);*/}).on("data", function(event) {
            setCurSells(event.returnValues.totalSupply);
          }).on('error', console.error);
    }, [])

    useEffect(() => {
        let response
        const interval = setInterval(async () => {
            setCount(count + 1);
            if (parseInt(serial_num) < (parseInt(cursells)+1)){
                response = await client.query(q.Get(q.Ref(q.Collection('Metadata'), serial_num)))
                setComments(response.data);
            } else {
                setComments("Someone is being naughty ( ͡° ͜ʖ ͡°)");
            }
        }, 1000);
        return () => clearInterval(interval)
      }, [count, serial_num, cursells]);


    console.log(cursells)
    console.log(comments)
    return <div><pre>{ (parseInt(serial_num) < (parseInt(cursells)+1)) ? JSON.stringify(comments, null, 4) : comments }</pre></div>
}

export default function Metadata(){
    
    return (
        <Router>
            <React.Fragment>
                <Route path='/metadata/:serial_num'>
                    <GenerateMetadata />
                </Route>
            </React.Fragment>
        </Router>
    )
}