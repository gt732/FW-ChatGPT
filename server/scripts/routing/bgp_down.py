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
parser.add_argument("--bgp-neighbor", required=True, help="IP of the BGP Neighbor")
args = parser.parse_args()


device = {
    "device_type": "fortinet",
    "ip": args.device_host,
    "username": args.ssh_username,
    "password": args.ssh_password,
    "fast_cli": False,
    "port": args.ssh_port,
}


debug_commands = [
    "get router info bgp summary",
    "diagnose sys tcpsock | grep 179",
    f"get router info bgp neighbors {args.bgp_neighbor}",
    f"execute ping {args.bgp_neighbor}",
]


with ConnectHandler(**device) as net_connect:
    debug_output = f"""As a Senior Network/Firewall Engineer, you have been assigned to investigate a BGP Down issue for BGP Neighbor: {args.bgp_neighbor}.\n
                    Pay close attention to the BGP neighbor {args.bgp_neighbor} in the debug output, make sure to look at the STATE. \n"""

    for command in debug_commands:
        debug_output += f"Running command: {command}\n\n"
        debug_output += net_connect.send_command_timing(
            command, delay_factor=2, max_loops=1000
        )
        debug_output += "\n\n"

        if len(debug_output) > MAX_CHARS:
            debug_output = debug_output[-MAX_CHARS:]

    print(debug_output)
