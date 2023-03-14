import streamlit as st
import netmiko
import requests
import openai
import os
from netmiko import NetMikoTimeoutException, NetMikoAuthenticationException
from fortigate_api import Fortigate

openai.api_key = os.getenv("OPENAI_API_KEY")
model_engine = "gpt-3.5-turbo"
MAX_CHARS = 4000


def main():
    st.set_page_config(
        page_title="FortiGPT Troubleshooting Assistant", page_icon=":shield:"
    )

    st.sidebar.title("FortiGPT")
    st.sidebar.write("Welcome to the FortiGPT Troubleshooting Assistant!")
    st.sidebar.write("Please fill in the following information to get started:")
    device_type = st.sidebar.selectbox("Device Type", ["FortiGate"])
    device_ip = st.sidebar.text_input("Device IP Address")
    scheme = st.sidebar.radio(
        "HTTP or HTTPS?",
        (
            "http",
            "https",
        ),
        horizontal=True,
    )
    scheme_port = st.sidebar.text_input(
        "HTTP/HTTPS Port",
        placeholder="Empty for HTTP Default: 80, HTTPS Default: 443",
    )
    ssh_port = st.sidebar.text_input("SSH Port", placeholder="Empty for Default: 22")
    if not ssh_port:
        ssh_port = 22
    device_username = st.sidebar.text_input("Device Username")
    device_password = st.sidebar.text_input("Device Password", type="password")
    # **********************************************************************************************************************
    # ******************** GENERATE Fortigate Session OBJECT ***************************************************************
    # **********************************************************************************************************************
    with st.container():
        with st.sidebar:
            if st.button("Login to FortiGate"):
                try:
                    fgt = Fortigate(
                        host=device_ip,
                        username=device_username,
                        password=device_password,
                        scheme=scheme,
                        port=scheme_port,
                    )
                    fgt.login()
                    if fgt.is_connected:
                        st.session_state["fgt_session"] = fgt
                    else:
                        st.write(":x: Login Failed :x:")
                        return
                except Exception as e:
                    st.write(":x: Login Failed :x:")
                    st.write(e)
                    return
            if "fgt_session" not in st.session_state:
                st.write(":exclamation: Not Logged In :exclamation:")
            else:
                st.write(":heavy_check_mark: Logged In :heavy_check_mark:")
    # **********************************************************************************************************************
    # ******************** SIDE BAR PROBLEM CATEGORY LIST*******************************************************************
    # **********************************************************************************************************************
    problem_category = st.sidebar.selectbox(
        "Problem Category", ["", "Performance", "VPN"]
    )
    # **********************************************************************************************************************
    # ******************** VPN CATEGORY ************************************************************************************
    # **********************************************************************************************************************
    if problem_category == "VPN":

        def get_vpn_tunnels() -> list:
            data = st.session_state.fgt_session.get(
                url="api/v2/cmdb/vpn.ipsec/phase1-interface/"
            )
            return list(tunnel["name"] for tunnel in data)

        vpn_tunnel = st.sidebar.selectbox(
            "VPN Tunnel List",
            get_vpn_tunnels(),
        )

        def get_phase2_name(vpn_tunnel_name) -> str:
            data = st.session_state.fgt_session.get(
                url=f"api/v2/cmdb/vpn.ipsec/phase2-interface/"
            )
            for phase2 in data:
                if phase2["phase1name"] == vpn_tunnel_name:
                    phase2_name = phase2["name"]
                    return phase2_name
            return None

        phase2_name = get_phase2_name(vpn_tunnel)

        # **********************************************************************************************************************
        # ******************** VPN PROBLEM TYPE LIST ***************************************************************************
        # **********************************************************************************************************************

        problem_type = st.sidebar.selectbox("Problem Type", ["Tunnel Down"])

        # **********************************************************************************************************************
        # ******************** VPN PROBLEM TYPE TUNNEL DOWN ********************************************************************
        # **********************************************************************************************************************
        if problem_type == "Tunnel Down":
            debug_prompt_path = os.path.join(
                "..", "debug_commands", "vpn", "debug_tunnel_down.txt"
            )
            with open(debug_prompt_path, "r") as f:
                debug_commands = f.read()
                debug_commands = debug_commands.splitlines()
                debug_commands.append("diagnose debug reset")
                debug_commands.append("diagnose debug application ike 15")
                debug_commands.append(f"diagnose vpn ike log-filter name {vpn_tunnel}")
                debug_commands.append("diagnose debug enable")
                debug_commands.append(f"get vpn ipsec tunnel name {vpn_tunnel}")
                debug_commands.append(
                    f"diag vpn tunnel up {phase2_name} {vpn_tunnel} 1"
                )
            chatgpt_prompt_path = os.path.join(
                "..", "chatgpt_prompts", "vpn", "tunnel_down.txt"
            )
            with open(chatgpt_prompt_path, "r") as f:
                chatgpt_prompt = f.read()
            documentation_link = "https://community.fortinet.com/t5/FortiGate/Troubleshooting-Tip-IPsec-VPNs-tunnels/ta-p/195955"

    # **********************************************************************************************************************
    # ******************** PERFORMANCE CATEGORY ****************************************************************************
    # **********************************************************************************************************************
    elif problem_category == "Performance":
        problem_type = st.sidebar.selectbox("Problem Type", ["High Memory"])

        # **********************************************************************************************************************
        # ******************** PERFORMANCE PROBLEM TYPE HIGH MEMORY  ***********************************************************
        # **********************************************************************************************************************

        if problem_type == "High Memory":
            debug_prompt_path = os.path.join(
                "..", "debug_commands", "performance", "debug_memory.txt"
            )
            with open(debug_prompt_path, "r") as f:
                debug_commands = f.read()
                debug_commands = debug_commands.splitlines()
            chatgpt_prompt_path = os.path.join(
                "..", "chatgpt_prompts", "performance", "high_memory.txt"
            )
            with open(chatgpt_prompt_path, "r") as f:
                chatgpt_prompt = f.read()
            documentation_link = "https://community.fortinet.com/t5/FortiGate/Technical-Tip-Basic-Troubleshooting-on-high-memory-or-high-CPU/ta-p/191669"

    # **********************************************************************************************************************
    # ******************** RUN DEBUG COMMANDS ******************************************************************************
    # **********************************************************************************************************************
    st.title("FortiGPT Troubleshooting Assistant")
    st.write("Please click the button below to run the debug commands:")

    if st.button("Run Debug Commands"):
        device = {
            "device_type": "fortinet",
            "ip": device_ip,
            "username": device_username,
            "password": device_password,
            "fast_cli": False,
            "port": ssh_port,
        }
        try:
            with st.spinner("Connecting to device..."):
                net_connect = netmiko.ConnectHandler(**device)
            debug_output = ""
            with st.spinner("Running debug commands..."):
                for command in debug_commands:
                    debug_output += f"Running command: {command}\n\n"
                    debug_output += net_connect.send_command_timing(
                        command, delay_factor=2, max_loops=100
                    )
                    debug_output += "\n\n"

                if len(debug_output) > MAX_CHARS:
                    debug_output = debug_output[-MAX_CHARS:]

            st.success("Debug commands completed successfully!")
            with st.container():
                st.text_area(
                    ":sparkles: DEBUG OUTPUT :sparkles:",
                    debug_output,
                    height=500,
                    key="debug_textarea",
                )
        except (NetMikoTimeoutException, NetMikoAuthenticationException) as e:
            with st.container():
                st.text_area(
                    f":x: **Unable to connect to device {device_ip}** :x:",
                    e,
                    height=500,
                    key="netmikoerror_textarea",
                )
        finally:
            st.spinner(text=None)
        # **********************************************************************************************************************
        # ******************** CALL CHAT GPT API ******************************************************************************
        # **********************************************************************************************************************
        with st.container():
            st.write(
                f""":point_right: :warning: DISCLAIMER :warning: The advice provided is intended to be helpful, but should not be considered as 100% accurate or applicable in all situations.
                    It is important to consult official documentation and seek additional guidance as needed before making important decisions.
                    :books: :eyes: Please refer to the [Troubleshooting Guide]({documentation_link}) for more information. :point_left:"""
            )
            with st.spinner("Contacting ChatGPT API..."):
                try:
                    response = openai.ChatCompletion.create(
                        model="gpt-3.5-turbo",
                        messages=[
                            {"role": "system", "content": f"{chatgpt_prompt}."},
                            {"role": "user", "content": f"{debug_output}"},
                        ],
                    )
                    message = response.choices[0]["message"]
                    st.success("ChatGPT API call completed successfully!")
                    st.text_area(
                        ":robot_face: FortiGPT TROUBLESHOOTING ADVICE :robot_face:",
                        message["content"],
                        height=500,
                        key="chatgpt_textarea",
                    )
                except requests.exceptions.RequestException as e:
                    st.write("Error: Unable to connect to ChatGPT API")
                    st.write(e)
                    return


if __name__ == "__main__":
    main()
