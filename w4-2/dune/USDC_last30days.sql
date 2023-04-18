select
  Date_Trunc('day', minute) as Day,
  MAX(price) as Top,
  MIN(price) as Bottom,
  AVG(price) as Average
from prices.usd t
where -- t.symbol = 'USDC'
t.contract_address = 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48
and t.minute > now() - interval '30' day
group by 1
order by Day DESC nulls first