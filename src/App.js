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
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const App = () => {
  const time = Date.now();
  const secretKey = 'AQAAAABVQYDzMiowYGSXN8tLe1nx9ezUHZjOMQlQ+LgZ+3uPoQ==';
  const accessKey = '0100000000554180f3322a3060649737cb4b7b59f1c2bd1ebca486d667ca7ccea5b5ccce65';
  const customer = '275956';

  const [campaignList, setCampaignList] = useState([]);
  const [adGroupList, setAdGroupList] = useState([]);
  const [keywordList, setKeywordList] = useState([]);
  const [selectCampaignId, setSelectCampaignId] = useState('');
  const [selectAdgroupId, setSelectAdgroupId] = useState('');
  const [loading, setLoading] = useState(false);

  const getHeader = (method, url) => {
    // generate signature 구하기
    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(time+'.'+method+'.'+url);
    const hash = hmac.finalize();
    const signature = hash.toString(CryptoJS.enc.Base64);
    return signature;
  }

  const getData = async (id, type) => {
    setLoading(true);
    if(type==='adgroups'){
      setSelectCampaignId(id);
    } else if (type==='keywordss'){
      setSelectAdgroupId(id)
    }
    const apiType = type === undefined ? 'campaigns' : (type === 'adgroups') ? 'adgroups' : 'keywords';
    const params = type === 'campaigns' ? {recordSize : 1000} : (type === 'adgroups') ?  {nccCampaignId:id} : {nccAdgroupId:id}

    console.log(params, apiType)
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
    }else if(type==='keywords'){
      setKeywordList(response.data);
    } else {
      setCampaignList(response.data);
    }
    setLoading(false);
  }

  useEffect(()=>{
    getData();
  },[selectCampaignId]);

  return (
    <div className='row'>
      { loading === true && (
        <Box sx={{ width: '100%' }} className="loading">
          <LinearProgress/>
        </Box>
      )}
      <div className='left_list'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" >
            <TableHead>
              <TableRow>
                <TableCell align="right">customerId</TableCell>
                <TableCell align="right">nccCampaignId</TableCell>
                <TableCell align="right">name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaignList.map(campaign => (
                  <TableRow
                    key={campaign.nccCampaignId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={()=> {
                      getData(campaign.nccCampaignId, 'adgroups');
                      setLoading(false);
                      setKeywordList([])
                    }}
                    hover={true}
                  >
                    <TableCell align="right">
                      {campaign.customerId}
                    </TableCell>
                    <TableCell align="right">
                      {campaign.nccCampaignId}
                    </TableCell>
                    <TableCell align="right">
                      {campaign.name}
                    </TableCell>
                  </TableRow>
              ))}
              </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className='right'>
        <div className='adGroup_list'>
          <ul>
            {adGroupList.map((adGroup, idx)=> (
              <li
                key={idx}
                onClick={()=> {
                  getData(adGroup.nccAdgroupId, 'keywords');
                  setLoading(false);
                }}
              >
                {adGroup.name}
              </li>
            ))}
          </ul>
        </div>
        <div className='keyword_list'>
          <ul>
            {keywordList.map(keyword=>{
              return(
                <li>
                  {keyword.keyword}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;