import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import gql from "graphql-tag";
import { useMutation, useSubscription } from "@apollo/client";
import { cookedOrders } from "../../__api__/cookedOrders";
import { Link, useHistory } from "react-router-dom";
import { takeOrder, takeOrderVariables } from "../../__api__/takeOrder";

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
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

const TAKE_ORDER_MUTATION = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-2xl">🚕</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lat: 37.5663,
    lng: 126.9779,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  });
  useEffect(() => {
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //   const geocoder = new google.maps.Geocoder();
      //   geocoder.geocode(
      //     {
      //       location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
      //     },
      //     (result, status) => {
      //       console.log(status);
      //       console.log(result);
      //     }
      //   );
    }
  });
  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = () => {
    if (map) {
      console.log(driverCoords.lat, driverCoords.lng);
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              driverCoords.lat - 0.05,
              driverCoords.lng - 0.05
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
  };
  const { data: cookedOrderData } = useSubscription<cookedOrders>(
    COOKED_ORDERS_SUBSCRIPTION
  );
  useEffect(() => {
    if (cookedOrderData?.cookedOrders.id) {
      makeRoute();
    }
  }, [cookedOrderData]);
  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/order/${cookedOrderData?.cookedOrders.id}`);
    }
  };
  const [takeOrder] = useMutation<takeOrder, takeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    }
  );
  const triggerTakeOrder = (id: number) => {
    takeOrder({
      variables: {
        input: {
          id,
        },
      },
    });
  };
  return (
    <div>
      <div
        className="bg-gray-800"
        style={{ width: window.innerWidth, height: "50vh" }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          defaultZoom={15}
          defaultCenter={{
            lat: 37.5663,
            lng: 126.9779,
          }}
          bootstrapURLKeys={{ key: "AIzaSyADlvJ_far8vwI9alrI_-TS1EFhFARyo0o" }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className="container mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrderData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-2xl font-medium">
              New Cooked Order
            </h1>
            <h4 className="text-center text-xl my-5">
              Pick it up soon! @{cookedOrderData.cookedOrders.restaurant?.name}
            </h4>
            <button
              onClick={() => triggerTakeOrder(cookedOrderData.cookedOrders.id)}
              className="btn w-full block text-center mt-5"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-2xl font-medium">No Orders Yet</h1>
        )}
      </div>
    </div>
  );
};
