import { useQuery, useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { Dish } from "../../components/dish";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__api__/myRestaurant";
import { pendingOrders } from "../../__api__/pendingOrders";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        id
        name
        coverImage
        category {
          name
        }
        address
        isPromoted
        menu {
          id
          name
          price
          photo
          description
          options {
            name
            extra
            choices {
              name
              extra
            }
          }
        }
        orders {
          id
          createdAt
          total
        }
      }
    }
  }
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      id
      status
      total
      deliver {
        email
      }
      customer {
        email
      }
      restaurant {
        name
      }
    }
  }
`;

interface IParams {
  id: string;
}

// const chartData = [
//   { x: 1, y: 3000 },
//   { x: 2, y: 1500 },
//   { x: 3, y: 4250 },
//   { x: 4, y: 1250 },
//   { x: 5, y: 2300 },
//   { x: 6, y: 7150 },
//   { x: 7, y: 6830 },
// ];

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      console.log("YES!");
      history.push(`/order/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData, history]);
  return (
    <div>
      <div
        className="bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10 mx-auto">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurant/${id}/create-dish`}
          className="mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant.menu?.length === 0 ? (
            <h4 className="text-xl mb-5">Please Upload a Dish</h4>
          ) : (
            <div className="grid px-3 md:px-0 md:grid-cols-3 gap-x-5 gap-y-1">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                ></Dish>
              ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="mx-auto">
            <VictoryChart
              height={500}
              width={window.innerWidth}
              theme={VictoryTheme.material}
              containerComponent={<VictoryVoronoiContainer />}
              domainPadding={20}
            >
              <VictoryAxis
                style={{ tickLabels: { fontSize: 15 } }}
                tickFormat={(step) =>
                  new Date(step).toLocaleDateString("ko", {
                    month: "2-digit",
                    day: "2-digit",
                  })
                }
              />
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 15 }}
                    renderInPortal
                    dy={-20}
                  ></VictoryTooltip>
                }
                data={data?.myRestaurant.restaurant.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
            </VictoryChart>
            {/* <VictoryChart domainPadding={20}>
              <VictoryAxis
                tickFormat={(step) => `$${step / 1000}K`}
                dependentAxis
              ></VictoryAxis>
              <VictoryAxis tickFormat={(step) => `Day ${step}`}></VictoryAxis>
              <VictoryBar data={chartData} />
            </VictoryChart> */}
          </div>
        </div>
      </div>
    </div>
  );
};
