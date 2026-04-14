import { supabase } from "../Config/supabaseClient.js";
import client from "../Config/redisConnect.js";

const SearchGetFlights = async (req, res) => {
  const { from, to, departure, returnDate } = req.query;

  if (!from || !to || !departure || !returnDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
const key=`${from}-${to}-${departure}-${returnDate}`

    const cachedFlights = await client.get(key);

    if (cachedFlights) {
return res.status(200).json(JSON.parse(cachedFlights));    }
    const { data, error } = await supabase
      .from("flight_prices_full")
      .select("*")
      .eq("origin_code", from.toUpperCase())
      .eq("destination_code", to.toUpperCase())
      .gte("departure_date", departure)
      .lte("departure_date", returnDate)
      .order("departure_date", { ascending: true });

    if (error) throw error;

    await client.set(key,JSON.stringify({flights:data}),"EX",3000)

    return res.status(200).json({ flights: data });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message });
  }
};

export default SearchGetFlights;
