import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  useColorScheme,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { DataContext } from "@/app/DataContext";
import { Album } from "../interfaces/albumInterface";
import { Photo } from "../interfaces/photoInterface";

const Albums = () => {
  const { albums, photos, users } = useContext(DataContext) || {
    albums: [],
    photos: [],
    users: [],
  };
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null
  );
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [albumSearch, setAlbumSearch] = useState("");
  const [photoSearch, setPhotoSearch] = useState("");
  const [albumUser, setAlbumUser] = useState<string>("");
  const [userFilter, setUserFilter] = useState<string>("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    fetchAllPhotos();
  }, []);

  const fetchAllPhotos = () => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((data) => setAllPhotos(data))
      .catch((error) => console.error("Error fetching photos:", error));
  };

  const filterPhotosByAlbumId = (albumId: number) => {
    return allPhotos.filter((photo) => photo.albumId === albumId);
  };

  const handleAlbumPress = (album: Album) => {
    const albumPhotos = filterPhotosByAlbumId(album.id);
    const user = users.find((user) => user.id === album.userId);
    setAlbumPhotos(albumPhotos);
    setSelectedAlbum(album);
    setAlbumUser(user ? user.name : "Unknown User");
    setPhotoSearch("");
  };

  const handlePhotoPress = (index: number) => {
    const originalIndex = albumPhotos.findIndex(
      (photo) => photo.id === filteredPhotos[index].id
    );
    setSelectedPhotoIndex(originalIndex);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
    setModalVisible(false);
  };

  const handlePreviousPhoto = () => {
    if (selectedPhotoIndex !== null) {
      const currentPhotoId = albumPhotos[selectedPhotoIndex]?.id;
      const filteredIndex = filteredPhotos.findIndex(
        (photo) => photo.id === currentPhotoId
      );
      const previousFilteredIndex =
        filteredIndex > 0 ? filteredIndex - 1 : filteredIndex;
      const previousOriginalIndex = albumPhotos.findIndex(
        (photo) => photo.id === filteredPhotos[previousFilteredIndex]?.id
      );
      setSelectedPhotoIndex(previousOriginalIndex);
    }
  };

  const handleNextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      const currentPhotoId = albumPhotos[selectedPhotoIndex]?.id;
      const filteredIndex = filteredPhotos.findIndex(
        (photo) => photo.id === currentPhotoId
      );
      const nextFilteredIndex =
        filteredIndex < filteredPhotos.length - 1
          ? filteredIndex + 1
          : filteredIndex;
      const nextOriginalIndex = albumPhotos.findIndex(
        (photo) => photo.id === filteredPhotos[nextFilteredIndex]?.id
      );
      setSelectedPhotoIndex(nextOriginalIndex);
    }
  };

  const renderAlbumItem = ({ item }: { item: Album }) => (
    <TouchableOpacity
      style={[styles.albumCard, isDarkMode ? styles.albumCardDark : null]}
      onPress={() => handleAlbumPress(item)}
    >
      <Text
        style={[styles.albumTitle, isDarkMode ? styles.albumTitleDark : null]}
      >
        {item.title}
      </Text>
      <Text
        style={[styles.albumUser, isDarkMode ? styles.albumUserDark : null]}
      >
        {users.find((user) => user.id === item.userId)?.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPhotoItem = ({ item, index }: { item: Photo; index: number }) => (
    <TouchableOpacity
      onPress={() => handlePhotoPress(index)}
      style={[styles.photoCard, isDarkMode ? styles.photoCardDark : null]}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.photoImage} />
      <View
        style={[
          styles.descriptionFrame,
          isDarkMode ? styles.descriptionFrameDark : null,
        ]}
      >
        <Text
          style={[styles.albumName, isDarkMode ? styles.albumNameDark : null]}
        >
          Album: {selectedAlbum?.title}
        </Text>
        <Text
          style={[
            styles.description,
            isDarkMode ? styles.descriptionDark : null,
          ]}
        >
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredAlbums = useMemo(
    () =>
      albums.filter(
        (album) =>
          album.title.toLowerCase().includes(albumSearch.toLowerCase()) &&
          (userFilter === "" ||
            users
              .find((user) => user.id === album.userId)
              ?.name.toLowerCase()
              .includes(userFilter.toLowerCase()))
      ),
    [albums, albumSearch, userFilter, users]
  );

  const filteredPhotos = useMemo(
    () =>
      albumPhotos.filter((photo) =>
        photo.title.toLowerCase().includes(photoSearch.toLowerCase())
      ),
    [albumPhotos, photoSearch]
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, isDarkMode ? styles.safeAreaDark : null]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          {!selectedAlbum ? (
            <View
              style={[
                styles.container,
                isDarkMode ? styles.containerDark : null,
              ]}
            >
              <Text
                style={[styles.heading, isDarkMode ? styles.headingDark : null]}
              >
                Albums
              </Text>
              <TextInput
                style={[
                  styles.searchInput,
                  isDarkMode ? styles.searchInputDark : null,
                ]}
                placeholder="Search Albums..."
                placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
                value={albumSearch}
                onChangeText={setAlbumSearch}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.searchInput,
                  isDarkMode ? styles.searchInputDark : null,
                ]}
                placeholder="Filter by User..."
                placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
                value={userFilter}
                onChangeText={setUserFilter}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          ) : (
            <View
              style={[
                styles.container,
                isDarkMode ? styles.containerDark : null,
              ]}
            >
              <Text
                style={[
                  styles.selectedAlbumTitle,
                  isDarkMode ? styles.selectedAlbumTitleDark : null,
                ]}
              >
                {selectedAlbum.title}
              </Text>
              <Text
                style={[
                  styles.selectedAlbumUser,
                  isDarkMode ? styles.selectedAlbumUserDark : null,
                ]}
              >
                {albumUser}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedAlbum(null)}
                style={[
                  styles.backButton,
                  isDarkMode ? styles.backButtonDark : null,
                ]}
              >
                <Text style={styles.backButtonText}>Back to Albums</Text>
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.searchInput,
                  isDarkMode ? styles.searchInputDark : null,
                ]}
                placeholder="Search Photos..."
                placeholderTextColor={isDarkMode ? "#ccc" : "#999"}
                value={photoSearch}
                onChangeText={setPhotoSearch}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          )}
        </View>
        {!selectedAlbum ? (
          <FlatList
            data={filteredAlbums}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderAlbumItem}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          <FlatList
            data={filteredPhotos}
            keyExtractor={(item) => item.id.toString()}
            key={`photos-${selectedAlbum.id}`}
            renderItem={renderPhotoItem}
            numColumns={2}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyboardShouldPersistTaps="handled"
          />
        )}
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
            <TouchableOpacity
              onPress={handlePreviousPhoto}
              style={styles.arrowLeft}
            >
              <Text style={styles.arrow}>{"<"}</Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              {selectedPhotoIndex !== null && (
                <Image
                  source={{ uri: albumPhotos[selectedPhotoIndex]?.url }}
                  style={styles.modalImage}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={handleNextPhoto}
              style={styles.arrowRight}
            >
              <Text style={styles.arrow}>{">"}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeAreaDark: {
    backgroundColor: "#000000",
  },
  container: {
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  containerDark: {
    backgroundColor: "#222",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  headingDark: {
    color: "#fff",
  },
  albumCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: 10,
    backgroundColor: "#e4e4e4",
  },
  albumCardDark: {
    borderColor: "#fff",
    backgroundColor: "#333",
  },
  albumTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  albumTitleDark: {
    color: "#fff",
  },
  albumUser: {
    fontSize: 14,
    color: "#000",
  },
  albumUserDark: {
    color: "#fff",
  },
  selectedAlbumTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#000",
  },
  selectedAlbumTitleDark: {
    color: "#fff",
  },
  selectedAlbumUser: {
    fontSize: 16,
    color: "#000",
  },
  selectedAlbumUserDark: {
    color: "#fff",
  },
  photoCard: {
    width: "45%",
    height: 350,
    margin: 10,
    position: "relative",
    overflow: "hidden",
    borderColor: "#000",
    borderWidth: 3,
    borderRadius: 10,
  },
  photoCardDark: {
    borderColor: "#fff",
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
    backgroundColor: "#222",
  },
  albumName: {
    fontWeight: "bold",
    color: "#000",
  },
  albumNameDark: {
    color: "#fff",
  },
  description: {
    marginTop: 5,
    color: "#555",
  },
  descriptionDark: {
    color: "#ccc",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 7,
    alignSelf: "flex-start",
  },
  backButtonDark: {
    backgroundColor: "#1a73e8",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
  arrowLeft: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  arrow: {
    fontSize: 30,
    color: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#000",
  },
  searchInputDark: {
    borderColor: "#555",
    color: "#fff",
  },
});

export default Albums;
