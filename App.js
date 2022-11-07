import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, Pressable, StyleSheet } from "react-native";
import { Realm, createRealmContext } from '@realm/react'
class Task extends Realm.Object {
  // _id!: Realm.BSON.ObjectId;
  // description!: string;
  // isComplete!: boolean;
  // createdAt!: Date;
  _id;
  description;
  isComplete;
  createdAt;

  //static generate(description: string) {
  static generate(description) {
    return {
      _id: new Realm.BSON.ObjectId(),
      description,
      createdAt: new Date(),
    };
  }

  static schema = {
    name: 'Task',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      description: 'string',
      isComplete: { type: 'bool', default: false },
      createdAt: 'date'
    },
  };
}

const { RealmProvider, useRealm, useQuery } = createRealmContext({ schema: [Task] })

export default function App() {
  return (
    <RealmProvider><TaskApp /></RealmProvider>
  )
}

function TaskApp() {
  const realm = useRealm();
  const tasks = useQuery(Task);
  const [newDescription, setNewDescription] = useState("")

  return (
    <View style = {styles.outerContainer}>
      <View style={styles.textInputContainer}>
        <TextInput
          value={newDescription}
          style = {styles.textInputText}
          placeholder="Enter new task description"
          onChangeText={setNewDescription}
        />
        <Pressable
          onPress={() => {
            realm.write(() => {
              realm.create("Task", Task.generate(newDescription));
            });
            setNewDescription("")
          }}><Text>➕</Text></Pressable>
      </View>
      <FlatList 
      data={tasks.sorted("createdAt")} 
      style = {styles.flatListContainer}
      keyExtractor={(item) => item._id.toHexString()} 
      renderItem={({ item }) => {
        return (
          <View style={styles.flatListComponent}>
            <Pressable
              onPress={() =>
                realm.write(() => {
                  item.isComplete = !item.isComplete
                })
              }><Text style = {styles.flatListText}>{item.isComplete ? "✅" : "☑️"}</Text></Pressable>
            <Text style={styles.flatListText} >{item.description}</Text>
            <Pressable
              onPress={() => {
                realm.write(() => {
                  realm.delete(item)
                })
              }} ><Text style = {styles.flatListText}>{"🗑️"}</Text></Pressable>
          </View>
        );
      }} ></FlatList>
    </View >
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: '#ac00ff',
    padding: 10,
    justifyContent: 'space-around',
    flex: 1
  },
  textInputContainer: {
    backgroundColor: '#af00ff',
    flexDirection: 'row', 
    justifyContent: 'space-evenly', 
    padding: 10,
    alignItems: 'center',
  },
  textInputText: {
    fontSize: 18,
    backgroundColor: '#ac00ff',
    color: 'white'
  },
  flatListContainer: {
    marginTop: 223,
    height: '40%',
    marginBottom: 30,
    flexDirection: 'column-reverse'
  },
  flatListComponent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    margin: 10, 
    borderBottomWidth: 1, 
    padding: 7, 
    alignItems: 'center',
    backgroundColor: '#ffffffc0',
    borderRadius: 23,
  },
  flatListText: {
    paddingHorizontal: 10,
    fontSize: 34
  },
})