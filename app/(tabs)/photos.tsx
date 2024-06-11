import React, { useState, useContext, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { DataContext } from "@/app/DataContext";
import { Photo } from "@/app/interfaces/photoInterface";
import { Album } from "@/app/interfaces/albumInterface";

const Photos = () => {
  const [searchTermTitle, setSearchTermTitle] = useState<string>("");
  const [searchTermAlbum, setSearchTermAlbum] = useState<string>("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const { photos } = useContext(DataContext) || { photos: [] };
  const [albums, setAlbums] = useState<Album[]>([]);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const getAlbumName = (albumId: number) => {
    const album = albums.find((album) => album.id === albumId);
    return album ? album.title : "Unknown Album";
  };

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((response) => response.json())
      .then((data: Album[]) => setAlbums(data))
      .catch((error) => console.error("Error fetching albums:", error));
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const albumName = getAlbumName(photo.albumId).toLowerCase();
      return (
        photo.title.toLowerCase().includes(searchTermTitle) &&
        albumName.includes(searchTermAlbum)
      );
    });
  }, [searchTermTitle, searchTermAlbum, photos, albums]);

  const openModal = (index: number) => setSelectedPhotoIndex(index);
  const closeModal = () => setSelectedPhotoIndex(null);
  const goToPreviousPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };
  const goToNextPhoto = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const renderItem = ({ item, index }: { item: Photo; index: number }) => (
    <TouchableOpacity key={item.id} onPress={() => openModal(index)} style={[styles.photoCard, isDarkMode && styles.photoCardDark]}>
      <Image source={{ uri: item.url }} style={styles.photoImage} />
      <View style={styles.descriptionFrame}>
        <Text style={styles.albumName}>Album: {getAlbumName(item.albumId)}</Text>
        <Text style={styles.description}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          value={searchTermTitle}
          onChangeText={(text) => setSearchTermTitle(text.toLowerCase())}
          placeholder="Search by title..."
          placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          value={searchTermAlbum}
          onChangeText={(text) => setSearchTermAlbum(text.toLowerCase())}
          placeholder="Search by album name..."
          placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        />
      </View>
      <ScrollView contentContainerStyle={styles.photosContainer}>
        {filteredPhotos.map((item, index) => renderItem({ item, index }))}
      </ScrollView>
      {selectedPhotoIndex !== null && (
        <Modal visible={selectedPhotoIndex !== null} transparent>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.modalClose} onPress={closeModal}>
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={goToPreviousPhoto}>
                <Text style={styles.arrow}>←</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: filteredPhotos[selectedPhotoIndex].url }}
                style={styles.modalImage}
              />
              <TouchableOpacity onPress={goToNextPhoto}>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  containerDark: {
    backgroundColor: "#151718",
  },
  searchContainer: {
    textAlign: "center",
    padding: 20,
  },
  searchInput: {
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  searchInputDark: {
    borderColor: "#555",
    backgroundColor: "#333333",
    color: "#ffffff",
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoCard: {
    width: 300,
    height: 350,
    margin: 25,
    position: "relative",
    overflow: "hidden",
    borderColor: "#000",
    borderWidth: 3,
    borderRadius: 10,
  },
  photoCardDark: {
    borderColor: "#555",
    backgroundColor: "#ffffff",
  },
  photoImage: {
    width: "100%",
    height: 245,
    objectFit: "cover",
  },
  descriptionFrame: {
    padding: 10,
    backgroundColor: "#ffffff", 
  },
  albumName: {
    fontWeight: "bold",
  },
  description: {
    marginTop: 5,
    color: "#555",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalClose: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 30,
    color: "#fff",
  },
  modalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  arrow: {
    fontSize: 30,
    color: "#fff",
    padding: 20,
  },
});

export default Photos;
