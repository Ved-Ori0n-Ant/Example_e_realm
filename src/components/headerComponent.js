import React, {Component} from "react";
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { deleteAllTodoLists } from "../database/allSchemas";

const HeaderComponent = props => {
    const { title, showAddTodoList, hasAddButton, hasSortButton, sort, sortState, hasDeleteAllButton } = props;
    return(
        <View style = {styles.container}>
            {hasAddButton &&
                <TouchableOpacity style = {styles.addButton} onPress = {showAddTodoList}>
                    <Image style = {styles.addButtonImg} source = {require('../assets/images/addIcon.png')} />
                </TouchableOpacity>}

            {hasDeleteAllButton && 
                <TouchableOpacity style={styles.addButton} onPress={() => {
                    Alert.alert(
                        'Delete all',
                        'Are you sure you want to delete all todoLists ?',
                        [
                            {
                                text: 'No', onPress: () => { },//Do nothing
                                style: 'cancel'
                            },
                            { 
                                text: 'Yes', onPress: () => {
                                    deleteAllTodoLists().then().catch(error => {
                                        alert(`Delete all TodoLists failed. Error = ${error}`);
                                    });                                     
                                }
                            },
                        ],
                        { cancelable: true }
                    );                    
                }
            }>
                <Image style={styles.deleteButtonImage} source={require('../assets/images/deleteIcon.png')}/>
            </TouchableOpacity>}  
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgb(224, 93, 144)',
        height: Platform.OS === 'ios' ? 100 : 80,
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        position: 'absolute',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 50,
    },
    addButton: {
        zIndex: 2,
        marginRight: 10,
        marginTop: 30,
    },  
    addButtonImg: {
        width: 42,
        height: 42,
        tintColor: 'white',
    },
});

export default HeaderComponent;