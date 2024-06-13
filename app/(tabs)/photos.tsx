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
  SafeAreaView
} from "react-native";
import { DataContext } from "@/app/DataContext";
import { Photo } from "@/app/interfaces/photoInterface";
import { Album } from "@/app/interfaces/albumInterface";

const Photos = () => {
  const [searchTermTitle, setSearchTermTitle] = useState<string>("");
  const [searchTermAlbum, setSearchTermAlbum] = useState<string>("");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const { photos } = useContext(DataContext) || { photos: [] };
  const [modalVisible, setModalVisible] = useState(false);
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

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
    setModalVisible(false);
  };

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
      <Image source={{ uri: item.thumbnailUrl }} style={styles.photoImage} />
      <View style={[styles.descriptionFrame, isDarkMode && styles.descriptionFrameDark]}>
        <Text style={[styles.albumName, isDarkMode && styles.albumNameDark]}>Album: {getAlbumName(item.albumId)}</Text>
        <Text style={[styles.description, isDarkMode && styles.descriptionDark]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.containerDark]}>
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
        <View style={styles.photosContainer}>
          {filteredPhotos.map((item, index) => renderItem({ item, index }))}
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modal}>
            <TouchableOpacity onPress={closeModal} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToPreviousPhoto} style={styles.arrowLeft}>
              <Text style={styles.arrow}>{"<"}</Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              {selectedPhotoIndex !== null && (
                <Image
                  source={{ uri: filteredPhotos[selectedPhotoIndex]?.url }}
                  style={styles.modalImage}
                />
              )}
            </View>
            <TouchableOpacity onPress={goToNextPhoto} style={styles.arrowRight}>
              <Text style={styles.arrow}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeAreaDark: {
    backgroundColor: '#000000',
  },
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#222',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: 300,
    height: 350,
    margin: 10,
    position: 'relative',
    overflow: 'hidden',
    borderColor: '#000',
    borderWidth: 3,
    borderRadius: 10,
    maxWidth: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  photoCardDark: {
    borderColor: '#fff',
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
  descriptionFrameDark: {
    backgroundColor: '#222',
  },
  albumName: {
    fontWeight: "bold",
    color: '#000',
  },
  albumNameDark: {
    color: '#fff',
  },
  description: {
    marginTop: 5,
    color: "#555",
  },
  descriptionDark: {
    color: '#ccc',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalCloseText: {
    fontSize: 30,
    color: '#fff',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  arrow: {
    fontSize: 30,
    color: '#fff',
  },
});

export default Photos;
