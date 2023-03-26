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
    "exec ping service.fortiguard.net",
    "exec ping update.fortiguard.net",
    "exec ping guard.fortinet.net",
    "diagnose debug rating",
    "show system fortiguard",
]


with ConnectHandler(**device) as net_connect:
    debug_output = ""

    for command in debug_commands:
        debug_output += f"Running command: {command}\n\n"
        debug_output += net_connect.send_command_timing(
            command, delay_factor=2, max_loops=1000
        )
        debug_output += "\n\n"

        if len(debug_output) > MAX_CHARS:
            debug_output = debug_output[-MAX_CHARS:]

    print(debug_output)
