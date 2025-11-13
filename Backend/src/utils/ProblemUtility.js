import axios from 'axios'

const getLanguagebyID=(lang)=>{
    const language={
        "c++":54,
        "java":62,
        "javascript":63
    }
    return language[lang.toLowerCase()]
}
const submitBatch=async(submissions)=>{
const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false' //if set true, means ki the batch we are submitting should already
    // be in base64_encoded form ,when false then it converts to base64_encoded form
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
return await fetchData();
}
const waiting=async(timer)=>{
    setTimeout(()=>{
        return 1;
    },timer);
}
const submitToken=async(resultToken)=>{
const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(","),
    base64_encoded: 'true',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': process.env.JUDGE0_KEY,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};
async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data
	} catch (error) {
		console.error(error);
	}
}
while(true){
const result= await fetchData();
const isResultObtained=result.submissions.every((r)=>r.status_id>2)
if(isResultObtained)
    return result.submissions
 await waiting(1000)
}
}
export {getLanguagebyID,submitBatch,submitToken}