using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using System.Collections.Generic;
using System.Collections;
using Newtonsoft.Json;
using TMPro;

public class ImageLoader : MonoBehaviour
{
    public ScrollRect scrollRect;
    public GameObject imagePrefab;
    public TMP_InputField  apiUrlInputField; // Reference to the input field for API URL
    private int currentPage = 1;
    private bool isLoading = false;

    void Start()
    {
        // Add a listener to the input field for changes
        apiUrlInputField.onValueChanged.AddListener(OnApiUrlChanged);
        FetchData();
    }

  

    void OnApiUrlChanged(string newUrl)
    {
        // Update the API URL and reset the current page
        apiUrlInputField.text = newUrl;
        currentPage = 1;
      //  FetchData();
    }

    public void FetchData()
    {
        // Use the API URL from the input field
        string apiUrl = apiUrlInputField.text;
        isLoading = true;
        StartCoroutine(FetchDataCoroutine(apiUrl));
    }

    IEnumerator FetchDataCoroutine(string url)
    {
       // string fullUrl = $"{url}?page={currentPage}";
        using (UnityWebRequest www = UnityWebRequest.Get(url))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Failed to fetch data: {www.error}");
                isLoading = false;
                yield break;
            }

            string jsonText = www.downloadHandler.text;
            Debug.Log($"JSON Response: {jsonText}");

            try
            {
                List<ImageData> images = JsonConvert.DeserializeObject<List<ImageData>>(jsonText);
                print(images.Count);
                if (images == null)
                {
                    Debug.LogError("Failed to parse JSON data into list.");
                    isLoading = false;
                    yield break;
                }

                // Clear existing images in the scroll view
                foreach (Transform child in scrollRect.content)
                {
                    Destroy(child.gameObject);
                }

                // Instantiate UI elements for fetched data
                foreach (ImageData imageData in images)
                {
                    GameObject imageGO = Instantiate(imagePrefab, scrollRect.content);
                    Image image = imageGO.transform.GetChild(0).GetComponent<Image>();
                    RectTransform rectTransform = imageGO.GetComponent<RectTransform>();

                    // Set image dimensions
                    rectTransform.sizeDelta = new Vector2(imageData.width, imageData.height);

                    StartCoroutine(LoadImage(imageData.url, image));
                }
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Error parsing JSON data: {e}");
            }
        }

        isLoading = false;
    }

    IEnumerator LoadImage(string url, Image image)
    {
        using (UnityWebRequest www = UnityWebRequestTexture.GetTexture(url))
        {
            yield return www.SendWebRequest();

            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Failed to load image: {www.error}");
                yield break;
            }

            Texture2D texture = ((DownloadHandlerTexture)www.downloadHandler).texture;
            Sprite sprite = Sprite.Create(texture, new Rect(0, 0, texture.width, texture.height), Vector2.zero);
            image.sprite = sprite;
        }
    }

    [System.Serializable]
    public class ImageData
    {
        public string id;
        public string url;
        public int width;
        public int height;
    }
}
