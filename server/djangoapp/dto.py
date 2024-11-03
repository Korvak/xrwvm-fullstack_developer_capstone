from dataclasses import dataclass

# dealer model


@dataclass
class DealershipDTO:

    id = int,
    short_name = str
    full_name = str
    city = str
    state = str
    address = str
    zip = int


def __str__(self):
    return f"{self.full_name} {self.city} {self.zip}"
