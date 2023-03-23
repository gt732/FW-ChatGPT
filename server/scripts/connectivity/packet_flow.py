import argparse
from netmiko import ConnectHandler

MAX_CHARS = 6000


parser = argparse.ArgumentParser(
    description="Script to execute commands on a Fortigate firewall"
)
parser.add_argument(
    "--device-host", required=True, help="Fortigate firewall hostname or IP"
)
parser.add_argument("--ssh-username", required=True, help="SSH username for the device")
parser.add_argument("--ssh-password", required=True, help="SSH password for the device")
parser.add_argument("--ssh-port", type=int, default=22, help="SSH port for the device")
parser.add_argument("--source-ip", default=None, help="Source IP address")
parser.add_argument("--destination-ip", default=None, help="Destination IP address")
parser.add_argument("--source-port", type=int, default=None, help="Source port")
parser.add_argument(
    "--destination-port", type=int, default=None, help="Destination port"
)
args = parser.parse_args()


device = {
    "device_type": "fortinet",
    "ip": args.device_host,
    "username": args.ssh_username,
    "password": args.ssh_password,
    "fast_cli": False,
    "port": args.ssh_port,
}

debug_commands = ["diagnose debug reset"]

if args.source_ip:
    debug_commands.append(f"diagnose debug flow filter saddr {args.source_ip}")
if args.destination_ip:
    debug_commands.append(f"diagnose debug flow filter daddr {args.destination_ip}")
if args.source_port:
    debug_commands.append(f"diagnose debug flow filter sport {args.source_port}")
if args.destination_port:
    debug_commands.append(f"diagnose debug flow filter dport {args.destination_port}")

debug_commands.append("dia debug flow show function-name enable")
debug_commands.append("diag debug flow trace start 10")
debug_commands.append("dia de enable")


with ConnectHandler(**device) as net_connect:
    debug_output = f"""As a Senior Network/Firewall Engineer, you have been assigned to investigate a Packet Flow issue for \n"""
    if args.source_ip:
        debug_output += f"Source IP: {args.source_ip} \n"
    if args.source_port:
        debug_output += f"Source Port: {args.source_port} \n"
    if args.destination_ip:
        debug_output += f"Destination IP: {args.destination_ip} \n"
    if args.destination_port:
        debug_output += f"Destination Port: {args.destination_port} \n"

    for command in debug_commands:
        debug_output += f"Running command: {command}\n\n"
        debug_output += net_connect.send_command_timing(
            command, delay_factor=2, max_loops=1000
        )
        debug_output += "\n\n"

        if len(debug_output) > MAX_CHARS:
            debug_output = debug_output[-MAX_CHARS:]

    print(debug_output)
