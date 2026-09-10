
async function refreshDashboard(){

  const data=await apiGet("dashboard");

  console.log(data);

}
