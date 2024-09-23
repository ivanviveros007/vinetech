import React from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

type SearchBarProps = {
  searchTerm: string;
  onSearch: (text: string) => void;
};

export const SearchBar = ({ searchTerm, onSearch }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search wines..."
        value={searchTerm}
        onChangeText={onSearch}
      />
      {searchTerm.length > 0 && (
        <TouchableOpacity onPress={() => onSearch('')} style={styles.clearButton}>
          <Ionicons name="close" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
});
