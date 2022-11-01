import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const App = () => {
  const time = Date.now();
  const secretKey = 'AQAAAABVQYDzMiowYGSXN8tLe1nx9ezUHZjOMQlQ+LgZ+3uPoQ==';
  const accessKey = '0100000000554180f3322a3060649737cb4b7b59f1c2bd1ebca486d667ca7ccea5b5ccce65';
  const customer = '275956';

  const [campaignList, setCampaignList] = useState([]);
  const [adGroupList, setAdGroupList] = useState([]);
  const [selectCampaignId, setSelectCampaignId] = useState('');

  const getHeader = (method, url) => {
    // generate signature 구하기
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(time+'.'+method+'.'+url);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);    

    return signature;
  }

  const getData = async (id, type) => {
    if(type==='adgroups'){
      setSelectCampaignId(id);
    }
    const apiType = type === undefined ? 'campaigns' : 'adgroups';
    const params = type === 'campaigns' ? {recordSize : 1000} : {nccCampaignId:id}

    const response = await axios.get(`/ncc/${apiType}`,{
      params,
      headers:{
        'X-Timestamp':time,
        'X-API-KEY':accessKey,
        'X-CUSTOMER':customer,
        'X-Signature':getHeader('GET', `/ncc/${apiType}`)
      }
    });
    console.log(response.data)

    if(type==='adgroups'){
      setAdGroupList(response.data);
    }else{
      setCampaignList(response.data);
    }
  }

  useEffect(()=>{
    getData()
  },[]);  

  return (
    <div>
      <div>
        {time}
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" >
          <TableHead>
            <TableRow>
              <TableCell>campaignTp</TableCell>
              <TableCell align="right">customerId</TableCell>
              <TableCell align="right">nccCampaignId</TableCell>
              <TableCell align="right">name</TableCell>
              <TableCell align="right">editTm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaignList.map(campaign => (
              <TableRow
                key={campaign.nccCampaignId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={()=> {
                  getData(campaign.nccCampaignId, 'adgroups') 
                  console.log('dd')
                }}
                hover={true}
              >
                <TableCell component="th" scope="row">
                  {campaign.campaignTp}
                </TableCell>
                <TableCell align="right">
                  {campaign.customerId}
                </TableCell>
                <TableCell align="right">
                  {campaign.nccCampaignId}
                </TableCell>
                <TableCell align="right">
                  {campaign.name}
                </TableCell>
                <TableCell align="right">
                  {campaign.editTm}
                </TableCell>
              </TableRow>
            ))}
            {adGroupList.map(adgroup => (
              <TableRow
                key={adgroup.nccCampaignId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={()=> {
                  getData(adgroup.nccCampaignId, 'adgroups') 
                  console.log('dd')
                }}
                hover={true}
              >
              <TableCell component="th" scope="row">
                {adgroup.campaignTp}
              </TableCell>
              <TableCell align="right">
                {adgroup.customerId}
              </TableCell>
              <TableCell align="right">
                {adgroup.nccCampaignId}
              </TableCell>
              <TableCell align="right">
                {adgroup.name}
              </TableCell>
              <TableCell align="right">
                {adgroup.editTm}
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default App;