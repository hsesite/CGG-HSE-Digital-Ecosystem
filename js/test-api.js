
async function testConnection(){

  const health=await apiGet("health");

  console.log(health);

}
