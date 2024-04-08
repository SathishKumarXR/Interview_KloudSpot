using UnityEngine;
using TMPro;

public class DataFromReact : MonoBehaviour
{
    public TextMeshProUGUI EmailText;
    public TextMeshProUGUI UsernameText;
    public string Email;
    public string Username;

    public class JsonObject
    {
        public string Email;
        public string Username;
    }
    // As you can see here is the name of the function that we get the data.
    // it should have the same name in RN function postMessage.
    public void GetDatas(string json)
    {
        JsonObject obj = JsonUtility.FromJson<JsonObject>(json);
        Email = obj.Email;
        Username = obj.Username;
        print("Email" + Email);
        print("Username" + Username);
        EmailText.text = Email;
        UsernameText.text = Username;

    }
}