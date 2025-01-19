import serial
import serial.tools.list_ports

def find_esp32_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if "CP210" in port.description or "CH340" in port.description:
            print(f"ESP32 detected on port: {port.device}")
            return port.device
    print("ESP32 not detected. Please check the connection.")
    return None

def connect_to_esp32(port):
    try:
        print(f"Connecting to ESP32 on {port}...")
        esp32 = serial.Serial(port, baudrate=115200, timeout=1)
        print("Successfully connected to ESP32.")
        return esp32
    except serial.SerialException as e:
        print(f"Error: Could not open port '{port}' - {e}")
        return None

if __name__ == "__main__":
    esp32_port = find_esp32_port()
    if esp32_port:
        esp32 = connect_to_esp32(esp32_port)
        if esp32:
            esp32.close()
            print("Connection closed.")
        else:
            print("Failed to connect to the ESP32. Check the port and permissions.")
    else:
        print("No ESP32 detected.")
