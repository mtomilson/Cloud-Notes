import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from '../firebase';

export default function useFirebaseData() {
  const [data, setData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;

    const collectionRef = collection(firestore, currentUser.uid);

    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(updatedData);
      },
      (error) => {
        console.error("Error fetching data: ", error);
      },
    );

    return () => unsubscribe();
  }, [currentUser]);

  return data;
}
