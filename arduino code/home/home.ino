#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
  #include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>

#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#define LedPin 14
#define fanPin 26
#define speakerStatusPIN 25
#define thermometerStatusPin 32

#define soundSensor 15

#define DHTPIN 2 
#define DHTTYPE    DHT11
DHT_Unified dht(DHTPIN, DHTTYPE);
uint32_t delayMS;

//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// Insert your network credentials
#define WIFI_SSID "ZTE_2.4G_C7bYyt"
#define WIFI_PASSWORD "sz7G3CRy"

// #define WIFI_SSID "elexlabs"
// #define WIFI_PASSWORD "bambulab"

// Insert Firebase project API Key
#define API_KEY "AIzaSyD_kSB9wubXBVw5IcU8RoKtLRw1bnXtphQ"

// Insert RTDB URLefine the RTDB URL */
#define DATABASE_URL "https://insyncweb-default-rtdb.firebaseio.com/" 

#define USER_EMAIL "admin@gmail.com"
#define USER_PASSWORD "12345678"

//Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;


void setup(){
  Serial.begin(115200);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();


   /* Assign the api key (required) */
  config.api_key = API_KEY;
  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);
  // Limit the size of response payload to be collected in FirebaseData
  fbdo.setResponseSize(2048);
  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(5);
  config.timeout.serverResponse = 10 * 1000;



  pinMode(soundSensor, INPUT);
  pinMode(LedPin, OUTPUT);
  pinMode(fanPin, OUTPUT);
  pinMode(speakerStatusPIN, OUTPUT);
  pinMode(thermometerStatusPin, OUTPUT);

  dht.begin();
  Serial.println(F("DHTxx Unified Sensor Example"));
  // Print temperature sensor details.
  sensor_t sensor;
  dht.temperature().getSensor(&sensor);
  Serial.println(F("------------------------------------"));
  Serial.println(F("Temperature Sensor"));
  Serial.print  (F("Sensor Type: ")); Serial.println(sensor.name);
  Serial.print  (F("Driver Ver:  ")); Serial.println(sensor.version);
  Serial.print  (F("Unique ID:   ")); Serial.println(sensor.sensor_id);
  Serial.print  (F("Max Value:   ")); Serial.print(sensor.max_value); Serial.println(F("°C"));
  Serial.print  (F("Min Value:   ")); Serial.print(sensor.min_value); Serial.println(F("°C"));
  Serial.print  (F("Resolution:  ")); Serial.print(sensor.resolution); Serial.println(F("°C"));
  Serial.println(F("------------------------------------"));
  // Print humidity sensor details.
  dht.humidity().getSensor(&sensor);
  Serial.println(F("Humidity Sensor"));
  Serial.print  (F("Sensor Type: ")); Serial.println(sensor.name);
  Serial.print  (F("Driver Ver:  ")); Serial.println(sensor.version);
  Serial.print  (F("Unique ID:   ")); Serial.println(sensor.sensor_id);
  Serial.print  (F("Max Value:   ")); Serial.print(sensor.max_value); Serial.println(F("%"));
  Serial.print  (F("Min Value:   ")); Serial.print(sensor.min_value); Serial.println(F("%"));
  Serial.print  (F("Resolution:  ")); Serial.print(sensor.resolution); Serial.println(F("%"));
  Serial.println(F("------------------------------------"));
  // Set delay between sensor readings based on sensor details.
 

  

 
}

void loop(){

  

    int LEDstatus;
    if (Firebase.RTDB.getInt(&fbdo, "devices/lamp", &LEDstatus)){
        digitalWrite(LedPin, LEDstatus);
        Serial.println("PASSED");
        Serial.println("data saved:" + LEDstatus);
        Serial.println("TYPE: " + fbdo.dataType());
    }
    int fanStatus;
    if (Firebase.RTDB.getInt(&fbdo, "devices/fan", &fanStatus)){
        digitalWrite(fanPin, fanStatus);
        Serial.println("PASSED");
        Serial.println("data saved:" + fanStatus);
        Serial.println("TYPE: " + fbdo.dataType());
    }
    int speakerStatus;
    if (Firebase.RTDB.getInt(&fbdo, "devices/speaker", &speakerStatus)){
        digitalWrite(speakerStatusPIN, speakerStatus);
        Serial.println("PASSED");
        Serial.println("data saved:" + speakerStatus);
        Serial.println("TYPE: " + fbdo.dataType());
    }
    int thermometerStatus;
    if (Firebase.RTDB.getInt(&fbdo, "devices/thermometer", &thermometerStatus)){
        digitalWrite(thermometerStatusPin, thermometerStatus);
        Serial.println("PASSED");
        Serial.println("data saved:" + thermometerStatus);
        Serial.println("TYPE: " + fbdo.dataType());
    }




    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature)) {
      Serial.println(F("Error reading temperature!"));
    }
    else {
      Serial.print(F("Temperature: "));
      Serial.print(event.temperature);
      Serial.println(F("°C"));
      if (Firebase.RTDB.setFloat(&fbdo, "sensors/temperature", event.temperature)){
        Serial.println("PASSED");
        Serial.println("data saved:" + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
      }
      else {
        Serial.println("FAILED");
        Serial.println("REASON: " + fbdo.errorReason());
      }
    }
    dht.humidity().getEvent(&event);
    if (isnan(event.relative_humidity)) {
      Serial.println(F("Error reading humidity!"));
    }
    else {
      Serial.print(F("Humidity: "));
      Serial.print(event.relative_humidity);
      Serial.println(F("%"));
      if (Firebase.RTDB.setFloat(&fbdo, "sensors/humidity", event.relative_humidity)){
        Serial.println("PASSED");
        Serial.println("data saved:" + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
    }
}


    int data = analogRead(soundSensor);
    if (Firebase.RTDB.setFloat(&fbdo, "sensors/sound", data)){
        Serial.println("PASSED");
        Serial.println( "sound data:" + data);
        Serial.println("sound saved:" + fbdo.dataPath());
        Serial.println("TYPE: " + fbdo.dataType());
      }
    else {
      Serial.println("FAILED");
      Serial.println("REASON: " + fbdo.errorReason());
    }
      
  
}


