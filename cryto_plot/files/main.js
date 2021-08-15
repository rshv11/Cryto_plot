

  const toJSON = JSON.stringify;
  
  const query = `
{
ethereum(network: bsc) {
    dexTrades(
    options: {limit: 1000, asc: "timeInterval.minute"}

    exchangeName: {is: "Pancake"}
    baseCurrency: {is: "0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf"}
    quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
  ) {
    timeInterval {
      minute(count: 1)
    }
    low: quotePrice(calculate: minimum)
    high: quotePrice(calculate: maximum)
    open: minimum(of: block, get: quote_price)
    close: maximum(of: block, get: quote_price)
    openTime: minimum(of: block, get: time)
    closeTime: maximum(of: block, get: time)
  }
}
}`;

  const res = await fetch('https://graphql.bitquery.io/', {
    method: 'POST',
  headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'X-API-KEY': 'BQYvhnv04csZHaprIBZNwtpRiDIwEIW9',
  }),
  body: JSON.stringify({ query }),
  mode: 'cors',
});
const data = await res.json();
console.log(data)


const finaldata =data.data.ethereum.dexTrades.map(it => {
    var date = new Date(it.timeInterval.minute)
    var milliseconds = date.getTime(); 
    // date=date.getTime()
    return {time:milliseconds,open:parseFloat( it.open),high:parseFloat(it.high),low:parseFloat(it.low),close:parseFloat(it.close)}
  });

console.log(finaldata)
// function toISODateTime(t) {
//   const date=  t.toISOString()
//   return date.getTime();
// }

// function toISODate(t) {
//   return toISODateTime(t).split('T')[0];
// }
  const chartProperties = {
    width:1200,
    height:600,
    timeScale:{
      timeVisible:true,
      secondsVisible:false,
    }
  }
  const domElement = document.getElementById('bitquery_div');
  const chart = LightweightCharts.createChart(domElement,chartProperties);
  const candleSeries = chart.addCandlestickSeries();
  candleSeries.setData(finaldata);