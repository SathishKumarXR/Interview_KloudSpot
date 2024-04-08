using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

public class NativeAPI : MonoBehaviour
{
#if UNITY_IOS && !UNITY_EDITOR
            [DllImport("__Internal")]
            public static extern void sendMessageToMobileApp(string message);
#endif
}

public class AuthScript : MonoBehaviour
{
    public static AuthScript instance;

    public void ButtonPressed()
    {
        if (Application.platform == RuntimePlatform.Android)
        {
            using (AndroidJavaClass jc = new AndroidJavaClass("com.azesmwayreactnativeunity.ReactNativeUnityViewManager"))
            {
                jc.CallStatic("sendMessageToMobileApp", "Logout");
            }
        }
        else if (Application.platform == RuntimePlatform.IPhonePlayer)
        {
#if UNITY_IOS && !UNITY_EDITOR
                        NativeAPI.sendMessageToMobileApp("Logout");
#endif
        }
    }
}
